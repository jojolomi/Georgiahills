import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const RATE_BUCKET_CAPACITY = Number(process.env.API_RATE_LIMIT_CAPACITY || 8);
const RATE_REFILL_TOKENS_PER_SEC = Number(process.env.API_RATE_LIMIT_REFILL_PER_SEC || 1);
const RATE_BUCKET_TTL_MS = 10 * 60 * 1000;
const rateBucketByKey = new Map();

function securityCsp() {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
    "img-src 'self' data: blob: https:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://*.supabase.co"
  ].join("; ");
}

function applySecurityHeaders(response) {
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("Content-Security-Policy", securityCsp());
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

function applyCacheHeaders(response, pathname, method) {
  const isGetOrHead = method === "GET" || method === "HEAD";
  if (!isGetOrHead) return response;

  if (pathname.startsWith("/_next/static/")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return response;
  }

  const immutableAssetRe = /\.(?:avif|webp|png|jpg|jpeg|gif|svg|ico|woff2?|css|js)$/i;
  if (immutableAssetRe.test(pathname) && !pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return response;
  }

  if (!pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  }

  return response;
}

function getIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.ip || request.headers.get("x-real-ip") || "unknown";
}

function consumeRateToken(key, nowMs) {
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

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const method = request.method.toUpperCase();

  if (pathname.startsWith("/api/") && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
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
      return applyCacheHeaders(applySecurityHeaders(response), pathname, method);
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
    return applyCacheHeaders(applySecurityHeaders(NextResponse.next({ request })), pathname, method);
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return applyCacheHeaders(applySecurityHeaders(NextResponse.next({ request })), pathname, method);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(items) {
        for (const { name, value, options } of items) {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        }
      }
    }
  });

  await supabase.auth.getUser();
  return applyCacheHeaders(applySecurityHeaders(response), pathname, method);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
