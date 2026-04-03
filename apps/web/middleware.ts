import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type TokenBucketState = {
  tokens: number;
  lastRefillMs: number;
};

const RATE_BUCKET_CAPACITY = Number(process.env.API_RATE_LIMIT_CAPACITY || 8);
const RATE_REFILL_TOKENS_PER_SEC = Number(process.env.API_RATE_LIMIT_REFILL_PER_SEC || 1);
const RATE_BUCKET_TTL_MS = 10 * 60 * 1000;
const rateBucketByKey = new Map<string, TokenBucketState>();

function createNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function securityCsp(nonce?: string) {
  const scriptSrc = nonce
    ? `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com`
    : "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com";

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
    "img-src 'self' data: blob: https:",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://*.supabase.co"
  ].join("; ");
}

function applySecurityHeaders(response: NextResponse, nonce?: string) {
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("Content-Security-Policy", securityCsp(nonce));
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

function getIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.ip || request.headers.get("x-real-ip") || "unknown";
}

function consumeRateToken(key: string, nowMs: number) {
  const existing = rateBucketByKey.get(key);
  if (!existing) {
    rateBucketByKey.set(key, {
      tokens: RATE_BUCKET_CAPACITY - 1,
      lastRefillMs: nowMs
    });
    return { allowed: true, remaining: RATE_BUCKET_CAPACITY - 1, retryAfterSec: 0 };
  }

  const elapsedSeconds = Math.max(0, (nowMs - existing.lastRefillMs) / 1000);
  const replenished = Math.min(
    RATE_BUCKET_CAPACITY,
    existing.tokens + elapsedSeconds * RATE_REFILL_TOKENS_PER_SEC
  );

  if (replenished < 1) {
    rateBucketByKey.set(key, {
      tokens: replenished,
      lastRefillMs: nowMs
    });
    return {
      allowed: false,
      remaining: Math.floor(replenished),
      retryAfterSec: Math.max(1, Math.ceil((1 - replenished) / Math.max(RATE_REFILL_TOKENS_PER_SEC, 0.001)))
    };
  }

  const nextTokens = replenished - 1;
  rateBucketByKey.set(key, {
    tokens: nextTokens,
    lastRefillMs: nowMs
  });

  for (const [bucketKey, bucket] of rateBucketByKey.entries()) {
    if (nowMs - bucket.lastRefillMs > RATE_BUCKET_TTL_MS) {
      rateBucketByKey.delete(bucketKey);
    }
  }

  return {
    allowed: true,
    remaining: Math.floor(nextTokens),
    retryAfterSec: 0
  };
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);
  const nonce = createNonce();
  const segment = pathname.split("/").filter(Boolean)[0] || "en";
  const locale = segment === "ar" ? "ar" : "en";
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-locale", locale);
  requestHeaders.set("x-csp-nonce", nonce);

  if (pathname.startsWith("/api/") && ["POST", "PUT", "PATCH", "DELETE"].includes(request.method.toUpperCase())) {
    const nowMs = Date.now();
    const ip = getIp(request);
    const key = `${ip}:${pathname}`;
    const rate = consumeRateToken(key, nowMs);

    if (!rate.allowed) {
      const response = NextResponse.json(
        {
          error: "rate_limited",
          message: "Too many requests. Please retry shortly."
        },
        { status: 429 }
      );
      response.headers.set("Retry-After", String(rate.retryAfterSec));
      response.headers.set("X-RateLimit-Limit", String(RATE_BUCKET_CAPACITY));
      response.headers.set("X-RateLimit-Remaining", String(rate.remaining));
      return applySecurityHeaders(response, nonce);
    }
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const requiresSessionRefresh =
    pathname.startsWith("/account/") ||
    pathname === "/login" ||
    pathname.startsWith("/admin/") ||
    pathname === "/admin";

  if (!requiresSessionRefresh) {
    return applySecurityHeaders(NextResponse.next({ request: { headers: requestHeaders } }), nonce);
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return applySecurityHeaders(NextResponse.next({ request: { headers: requestHeaders } }), nonce);
  }

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(items) {
        for (const { name, value, options } of items) {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options as CookieOptions);
        }
      }
    }
  });

  await supabase.auth.getUser();
  return applySecurityHeaders(response, nonce);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
