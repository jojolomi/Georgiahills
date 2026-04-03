#!/usr/bin/env node

const { setTimeout: delay } = require("timers/promises");

const baseUrlRaw = process.argv[2] || process.env.CUTOVER_BASE_URL || "https://georgiahills.com";
const mode = (process.argv[3] || process.env.CUTOVER_SMOKE_MODE || "strict").toLowerCase();

const smokeMatrix = [
  {
    path: "/",
    label: "home-en",
    tokens: ["rel=\"canonical\"", "hreflang=", "application/ld+json", "legal.html"]
  },
  {
    path: "/arabic.html",
    label: "home-ar",
    tokens: ["lang=\"ar\"", "dir=\"rtl\"", "rel=\"canonical\"", "hreflang=", "application/ld+json", "privacyModal"]
  },
  {
    path: "/booking.html",
    label: "booking-en",
    tokens: ["rel=\"canonical\"", "hreflang="]
  },
  {
    path: "/booking-ar.html",
    label: "booking-ar",
    tokens: ["lang=\"ar\"", "rel=\"canonical\"", "hreflang="]
  },
  {
    path: "/sitemap.xml",
    label: "sitemap",
    tokens: ["<urlset", "https://georgiahills.com"]
  },
  {
    path: "/robots.txt",
    label: "robots",
    tokens: ["Sitemap:"]
  }
];

function normalizeBaseUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    throw new Error("Base URL is empty. Provide a URL or set CUTOVER_BASE_URL.");
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const normalized = new URL(withProtocol);
  normalized.pathname = normalized.pathname.replace(/\/+$/, "");
  return normalized;
}

function warnOrFail(message) {
  if (mode === "warn") {
    process.stdout.write(`WARNING: ${message}\n`);
    return;
  }

  throw new Error(message);
}

async function fetchText(url, retries = 4) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent": "GH-Cutover-Smoke/1.0"
        }
      });

      clearTimeout(timeout);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const body = await response.text();
      return body;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt < retries) {
        await delay(2500 * attempt);
      }
    }
  }

  throw lastError;
}

async function main() {
  const baseUrl = normalizeBaseUrl(baseUrlRaw);
  process.stdout.write(`Running cutover smoke checks against ${baseUrl.origin} (${mode})\n`);

  for (const item of smokeMatrix) {
    const target = new URL(item.path, baseUrl.origin);
    let body = "";

    try {
      body = await fetchText(target.href);
    } catch (error) {
      warnOrFail(`${item.label} (${target.href}) fetch failed: ${error.message}`);
      continue;
    }

    const missing = item.tokens.filter((token) => !body.includes(token));
    if (missing.length > 0) {
      warnOrFail(`${item.label} (${target.href}) missing tokens: ${missing.join(", ")}`);
      continue;
    }

    process.stdout.write(`✔ ${item.label} (${target.href})\n`);
  }

  process.stdout.write("Cutover smoke check completed.\n");
}

main().catch((error) => {
  process.stderr.write(`Cutover smoke check failed: ${error.message}\n`);
  process.exitCode = 1;
});
