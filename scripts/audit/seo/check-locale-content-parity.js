#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const DEFAULT_MIN_RATIO = Number(process.env.GH_LOCALE_PARITY_MIN_RATIO || 0.45);

const ROOT_EXCLUDED = new Set(["404.html", "admin.html", "legal.html", "arabic.html", "index.html"]);

function fail(message) {
  process.stderr.write(`✖ ${message}\n`);
}

function ok(message) {
  process.stdout.write(`✔ ${message}\n`);
}

function warn(message) {
  process.stdout.write(`⚠ ${message}\n`);
}

function listRootHtmlFiles() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html") && !ROOT_EXCLUDED.has(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function countTokens(text) {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function collectPairs(files) {
  const set = new Set(files);
  const pairs = [];

  for (const file of files) {
    if (file.endsWith("-ar.html")) continue;
    const arPair = file.replace(/\.html$/, "-ar.html");
    if (set.has(arPair)) {
      pairs.push({ en: file, ar: arPair });
    }
  }

  return pairs;
}

function main() {
  if (!Number.isFinite(DEFAULT_MIN_RATIO) || DEFAULT_MIN_RATIO <= 0 || DEFAULT_MIN_RATIO > 1) {
    fail(`GH_LOCALE_PARITY_MIN_RATIO must be within (0, 1], received ${DEFAULT_MIN_RATIO}`);
    process.exit(1);
  }

  const files = listRootHtmlFiles();
  const pairs = collectPairs(files);

  if (!pairs.length) {
    ok("no EN/AR root page pairs found for parity check");
    return;
  }

  let passed = true;

  for (const pair of pairs) {
    const enPath = path.join(ROOT, pair.en);
    const arPath = path.join(ROOT, pair.ar);

    const enText = stripHtml(fs.readFileSync(enPath, "utf8"));
    const arText = stripHtml(fs.readFileSync(arPath, "utf8"));

    const enTokens = countTokens(enText);
    const arTokens = countTokens(arText);

    if (enTokens < 40 || arTokens < 40) {
      warn(
        `${pair.en} / ${pair.ar}: content is too short for reliable parity check (en=${enTokens}, ar=${arTokens}); skipped strict ratio enforcement`
      );
      continue;
    }

    const ratio = Math.min(enTokens, arTokens) / Math.max(enTokens, arTokens);
    if (ratio < DEFAULT_MIN_RATIO) {
      fail(
        `${pair.en} / ${pair.ar}: token parity ratio ${ratio.toFixed(2)} below ${DEFAULT_MIN_RATIO.toFixed(2)} (en=${enTokens}, ar=${arTokens})`
      );
      passed = false;
      continue;
    }

    ok(`${pair.en} / ${pair.ar}: token parity ratio ${ratio.toFixed(2)} (en=${enTokens}, ar=${arTokens})`);
  }

  if (!passed) {
    process.exit(1);
  }

  ok("locale content parity checks passed");
}

main();
