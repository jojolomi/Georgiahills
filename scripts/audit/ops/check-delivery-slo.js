#!/usr/bin/env node

const { performance } = require("node:perf_hooks");

const baseUrlRaw = process.argv[2] || "https://georgiahills.com";
const mode = (process.argv[3] || "warn").toLowerCase();

const validModes = new Set(["warn", "strict"]);

const profiles = {
  warn: {
    maxRedirects: 2,
    maxTtfbMs: 2200,
    requireCompression: false
  },
  strict: {
    maxRedirects: 1,
    maxTtfbMs: 1500,
    requireCompression: true
  }
};

const checks = [
  { path: "/", label: "home" },
  { path: "/arabic.html", label: "home-ar" },
  { path: "/booking.html", label: "booking" },
  { path: "/destination.html?id=tbilisi", label: "destination" },
  { path: "/script.min.js", label: "script" },
  { path: "/style.min.css", label: "style" }
];

function warnOrFail(modeValue, message) {
  if (modeValue === "strict") {
    throw new Error(message);
  }
  process.stdout.write(`⚠ ${message}\n`);
}

function normalizeBaseUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    throw new Error("Base URL is required");
  }

  const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return new URL(normalized);
}

function isCompressed(headers) {
  const encoding = (headers.get("content-encoding") || "").toLowerCase();
  return encoding.includes("br") || encoding.includes("gzip") || encoding.includes("deflate");
}

async function fetchWithMetrics(url, maxRedirects) {
  let currentUrl = new URL(url);
  let redirects = 0;
  let finalResponse = null;
  let totalTtfbMs = 0;

  while (redirects <= maxRedirects) {
    const started = performance.now();
    const response = await fetch(currentUrl.href, {
      redirect: "manual",
      headers: {
        "cache-control": "no-cache"
      }
    });
    const ttfbMs = performance.now() - started;
    totalTtfbMs += ttfbMs;

    const location = response.headers.get("location");
    const isRedirect = response.status >= 300 && response.status < 400 && location;

    if (!isRedirect) {
      finalResponse = response;
      return {
        redirects,
        ttfbMs: Number(totalTtfbMs.toFixed(1)),
        finalResponse
      };
    }

    redirects += 1;
    currentUrl = new URL(location, currentUrl);
  }

  throw new Error(`Redirect chain exceeded ${maxRedirects}`);
}

async function main() {
  if (!validModes.has(mode)) {
    throw new Error(`Invalid mode '${mode}'. Use 'warn' or 'strict'.`);
  }

  const profile = profiles[mode];
  const baseUrl = normalizeBaseUrl(baseUrlRaw);
  process.stdout.write(`Running delivery SLO checks against ${baseUrl.origin} (${mode})\n`);

  for (const check of checks) {
    const target = new URL(check.path, baseUrl.origin);

    try {
      const result = await fetchWithMetrics(target.href, profile.maxRedirects);
      const status = result.finalResponse.status;

      if (status >= 400) {
        warnOrFail(mode, `${check.label} (${target.href}) returned HTTP ${status}`);
        continue;
      }

      if (result.redirects > profile.maxRedirects) {
        warnOrFail(mode, `${check.label} (${target.href}) redirect chain too long: ${result.redirects}`);
      }

      if (result.ttfbMs > profile.maxTtfbMs) {
        warnOrFail(mode, `${check.label} (${target.href}) TTFB too high: ${result.ttfbMs}ms > ${profile.maxTtfbMs}ms`);
      }

      if (profile.requireCompression && !isCompressed(result.finalResponse.headers)) {
        warnOrFail(mode, `${check.label} (${target.href}) missing compression (content-encoding)`);
      }

      process.stdout.write(
        `✔ ${check.label}: status=${status}, redirects=${result.redirects}, ttfb=${result.ttfbMs}ms, encoding=${
          result.finalResponse.headers.get("content-encoding") || "none"
        }\n`
      );
    } catch (error) {
      warnOrFail(mode, `${check.label} (${target.href}) failed: ${error.message}`);
    }
  }
}

main().catch((error) => {
  process.stderr.write(`✖ ${error.message}\n`);
  process.exit(1);
});
