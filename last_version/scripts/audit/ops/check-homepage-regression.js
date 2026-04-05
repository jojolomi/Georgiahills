#!/usr/bin/env node

const { setTimeout: delay } = require("timers/promises");

const targetUrl = process.argv[2];
const mode = process.argv[3] || "strict";

if (!targetUrl) {
  process.stderr.write("Usage: node scripts/audit/ops/check-homepage-regression.js <url> [strict|warn]\n");
  process.exit(1);
}

const forbiddenMarkers = [
  'href="style.css"',
  'src="script.js"',
  'src="Signagi.webp"',
  'src="Martvili.webp"',
  'src="Tbilisi.webp"',
  'src="Kazbegi.webp"'
];

const requiredMarkers = [
  "application/ld+json"
];

async function fetchWithRetry(url, retries = 4) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent": "GH-SEO-Regression-Check/1.0"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      clearTimeout(timeout);
      return html;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt < retries) {
        await delay(3000 * attempt);
      }
    }
  }

  throw lastError;
}

async function main() {
  process.stdout.write(`Checking homepage HTML markers for ${targetUrl} (${mode})\n`);

  let html;
  try {
    html = await fetchWithRetry(targetUrl);
  } catch (error) {
    if (mode === "warn") {
      process.stdout.write(`WARNING: Could not fetch ${targetUrl}: ${error.message}\n`);
      return;
    }
    throw error;
  }

  for (const marker of requiredMarkers) {
    if (!html.includes(marker)) {
      throw new Error(`Missing required marker: ${marker}`);
    }
  }

  const foundForbidden = forbiddenMarkers.filter((marker) => html.includes(marker));
  if (foundForbidden.length > 0) {
    const message = `Detected legacy markers: ${foundForbidden.join(", ")}`;
    if (mode === "warn") {
      process.stdout.write(`WARNING: ${message}\n`);
      return;
    }

    throw new Error(message);
  }

  process.stdout.write("Homepage regression check passed.\n");
}

main().catch((error) => {
  process.stderr.write(`Homepage regression check failed: ${error.message}\n`);
  process.exitCode = 1;
});
