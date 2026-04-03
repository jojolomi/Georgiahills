const fs = require("fs");
const path = require("path");

const distDir = path.resolve(process.argv[2] || "astro-site/dist");
const SITE_BASE = "https://georgiahills.com";

function collectHtml(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtml(full, out);
      continue;
    }
    if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function fail(msg) {
  process.stderr.write(`✖ ${msg}\n`);
}

function ok(msg) {
  process.stdout.write(`✔ ${msg}\n`);
}

function isValidHreflangCode(code) {
  return /^[a-z]{2}(?:-[a-z]{2})?$/i.test(code) || code.toLowerCase() === "x-default";
}

function normalizeAbsoluteUrl(url) {
  return String(url || "").replace(/\/$/, "");
}

function toLocalDistPath(url) {
  if (!url || !/^https?:\/\//i.test(url)) return null;

  try {
    const parsed = new URL(url);
    if (parsed.origin.toLowerCase() !== SITE_BASE) return null;
    let pathname = parsed.pathname || "/";
    if (pathname.endsWith("/")) pathname += "index.html";
    if (!pathname.endsWith(".html")) pathname += ".html";
    return pathname.replace(/^\//, "");
  } catch {
    return null;
  }
}

if (!fs.existsSync(distDir)) {
  fail(`dist directory not found: ${distDir}`);
  process.exit(1);
}

// Skip non-SEO utility pages (admin routes, lighthouse reports, tmp files)
const skipRe = /(?:^|\/)(?:admin\.html|admin-v3\/.*\.html|.*\.report\.html|tmp_.*\.html)$/;

let passed = true;
const files = collectHtml(distDir);
const htmlByRelPath = new Map();

for (const file of files) {
  const rel = path.relative(distDir, file).replace(/\\/g, "/");
  htmlByRelPath.set(rel, fs.readFileSync(file, "utf8"));
}

for (const file of files) {
  const rel = path.relative(distDir, file).replace(/\\/g, "/");
  if (skipRe.test(rel)) continue;

  const html = htmlByRelPath.get(rel) || "";

  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (!canonicalMatch) {
    fail(`${rel}: missing canonical`);
    passed = false;
  } else if (!/^https?:\/\//i.test(canonicalMatch[1])) {
    fail(`${rel}: canonical must be absolute URL`);
    passed = false;
  }

  const alternates = [...html.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["']\s+href=["']([^"']+)["']/gi)]
    .map((m) => ({ hreflang: m[1], href: m[2] }));

  const hreflangs = alternates.map((item) => item.hreflang.toLowerCase());
  const hasXDefault = hreflangs.includes("x-default");
  const hasEnOrAr = hreflangs.includes("en") || hreflangs.includes("ar");

  if (!hasXDefault || !hasEnOrAr) {
    fail(`${rel}: hreflang set incomplete`);
    passed = false;
  }

  const seenCodes = new Set();
  for (const alt of alternates) {
    const code = alt.hreflang.toLowerCase();
    if (!isValidHreflangCode(code)) {
      fail(`${rel}: invalid hreflang code ${alt.hreflang}`);
      passed = false;
    }
    if (seenCodes.has(code)) {
      fail(`${rel}: duplicate hreflang code ${alt.hreflang}`);
      passed = false;
    }
    seenCodes.add(code);
  }

  if (canonicalMatch) {
    const canonical = normalizeAbsoluteUrl(canonicalMatch[1]);
    const selfLinked = alternates.some((alt) => normalizeAbsoluteUrl(alt.href) === canonical);
    if (!selfLinked) {
      fail(`${rel}: canonical URL missing from hreflang alternates`);
      passed = false;
    }
  }

  const canonicalUrl = canonicalMatch ? normalizeAbsoluteUrl(canonicalMatch[1]) : "";
  const isMarketLanding = /^https:\/\/georgiahills\.com\/(ae|sa|qa|kw|eg)$/i.test(canonicalUrl);
  const hasLanguagePair = hreflangs.includes("en") && hreflangs.includes("ar");

  for (const alt of alternates) {
    if (!hasLanguagePair || isMarketLanding) break;
    if (alt.hreflang.toLowerCase() === "x-default") continue;

    const targetRel = toLocalDistPath(alt.href);
    if (!targetRel || !htmlByRelPath.has(targetRel)) continue;

    const targetHtml = htmlByRelPath.get(targetRel) || "";
    const targetAlternates = [...targetHtml.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["'][^"']+["']\s+href=["']([^"']+)["']/gi)]
      .map((m) => normalizeAbsoluteUrl(m[1]));

    const thisCanonical = canonicalMatch ? normalizeAbsoluteUrl(canonicalMatch[1]) : null;
    if (thisCanonical && !targetAlternates.includes(thisCanonical)) {
      fail(`${rel}: hreflang reciprocal missing in ${targetRel} back to ${thisCanonical}`);
      passed = false;
    }
  }
}

if (!passed) process.exit(1);
ok(`hreflang validation passed for ${files.length} pages`);
