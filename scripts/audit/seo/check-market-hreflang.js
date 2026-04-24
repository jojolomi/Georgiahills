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

const EN_REFERENCE_URL = "https://georgiahills.com/index.html";

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
  const canonicalUrl = `https://georgiahills.com/${market.code}/`;

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
  const hasArabicLang = /<html\s+[^>]*lang=["']ar["']/i.test(html);
  const hasRtlDir = /<html\s+[^>]*dir=["']rtl["']/i.test(html);

  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const canonicalHref = canonicalMatch ? canonicalMatch[1] : "";

  const ogUrlMatch = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
  const ogUrl = ogUrlMatch ? ogUrlMatch[1] : "";

  const marketHrefMatch = html.match(new RegExp(`<link\\s+rel=["']alternate["']\\s+hreflang=["']${market.hreflang}["']\\s+href=["']([^"']+)["']`, "i"));
  const marketHref = marketHrefMatch ? marketHrefMatch[1] : "";

  const enHrefMatch = html.match(/<link\s+rel=["']alternate["']\s+hreflang=["']en["']\s+href=["']([^"']+)["']/i);
  const enHref = enHrefMatch ? enHrefMatch[1] : "";

  const xDefaultHrefMatch = html.match(/<link\s+rel=["']alternate["']\s+hreflang=["']x-default["']\s+href=["']([^"']+)["']/i);
  const xDefaultHref = xDefaultHrefMatch ? xDefaultHrefMatch[1] : "";

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
  if (!hasArabicLang) {
    fail(`${rel}: html lang must be ar`);
    passed = false;
  }
  if (!hasRtlDir) {
    fail(`${rel}: html dir must be rtl`);
    passed = false;
  }
  if (canonicalHref !== canonicalUrl) {
    fail(`${rel}: canonical mismatch (expected ${canonicalUrl}, found ${canonicalHref || "missing"})`);
    passed = false;
  }
  if (ogUrl !== canonicalUrl) {
    fail(`${rel}: og:url mismatch (expected ${canonicalUrl}, found ${ogUrl || "missing"})`);
    passed = false;
  }
  if (marketHref !== canonicalUrl) {
    fail(`${rel}: hreflang=${market.hreflang} href mismatch (expected ${canonicalUrl}, found ${marketHref || "missing"})`);
    passed = false;
  }
  if (enHref !== EN_REFERENCE_URL) {
    fail(`${rel}: hreflang=en href mismatch (expected ${EN_REFERENCE_URL}, found ${enHref || "missing"})`);
    passed = false;
  }
  if (xDefaultHref !== EN_REFERENCE_URL) {
    fail(`${rel}: hreflang=x-default href mismatch (expected ${EN_REFERENCE_URL}, found ${xDefaultHref || "missing"})`);
    passed = false;
  }

  if (
    hasMarketHreflang &&
    hasEn &&
    hasXDefault &&
    hasOgLocale &&
    hasArabicLang &&
    hasRtlDir &&
    canonicalHref === canonicalUrl &&
    ogUrl === canonicalUrl &&
    marketHref === canonicalUrl &&
    enHref === EN_REFERENCE_URL &&
    xDefaultHref === EN_REFERENCE_URL
  ) {
    ok(`${rel}: market hreflang, canonical, and locale metadata are consistent`);
  }
}

if (!passed) {
  process.exit(1);
}
