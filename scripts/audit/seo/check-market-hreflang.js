#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();

const MARKETS = [
  { code: "ae", hreflang: "ar-AE", ogLocale: "ar_AE" },
  { code: "sa", hreflang: "ar-SA", ogLocale: "ar_SA" },
  { code: "qa", hreflang: "ar-QA", ogLocale: "ar_QA" },
  { code: "kw", hreflang: "ar-KW", ogLocale: "ar_KW" },
  { code: "eg", hreflang: "ar-EG", ogLocale: "ar_EG" }
];

function fail(message) {
  process.stderr.write(`✖ ${message}\n`);
}

function ok(message) {
  process.stdout.write(`✔ ${message}\n`);
}

let passed = true;

for (const market of MARKETS) {
  const file = path.join(ROOT, market.code, "index.html");
  const rel = `${market.code}/index.html`;

  if (!fs.existsSync(file)) {
    fail(`${rel}: missing file`);
    passed = false;
    continue;
  }

  const html = fs.readFileSync(file, "utf8");
  const hasMarketHreflang = new RegExp(`<link\\s+rel=["']alternate["']\\s+hreflang=["']${market.hreflang}["']`, "i").test(html);
  const hasEn = /<link\s+rel=["']alternate["']\s+hreflang=["']en["']/i.test(html);
  const hasXDefault = /<link\s+rel=["']alternate["']\s+hreflang=["']x-default["']/i.test(html);
  const hasOgLocale = new RegExp(`<meta\\s+property=["']og:locale["']\\s+content=["']${market.ogLocale}["']`, "i").test(html);

  if (!hasMarketHreflang) {
    fail(`${rel}: missing hreflang=${market.hreflang}`);
    passed = false;
  }
  if (!hasEn) {
    fail(`${rel}: missing hreflang=en`);
    passed = false;
  }
  if (!hasXDefault) {
    fail(`${rel}: missing hreflang=x-default`);
    passed = false;
  }
  if (!hasOgLocale) {
    fail(`${rel}: missing og:locale=${market.ogLocale}`);
    passed = false;
  }

  if (hasMarketHreflang && hasEn && hasXDefault && hasOgLocale) {
    ok(`${rel}: market hreflang and og:locale are consistent`);
  }
}

if (!passed) {
  process.exit(1);
}
