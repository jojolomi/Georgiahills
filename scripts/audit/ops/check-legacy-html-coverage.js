#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const ASTRO_PAGES_DIR = path.join(ROOT, "astro-site", "src", "pages");
const SECONDARY_PAGES_FILE = path.join(ROOT, "apps", "web", "src", "config", "secondary-pages.ts");
const LEGACY_MAP_FILE = path.join(ROOT, "scripts", "config", "legacy-route-map.json");

const EXCLUDED_LEGACY_HTML = new Set(["404.html", "admin.html", "legal.html"]);

const CORE_EXPECTED_FILES = [
  "index.html",
  "arabic.html",
  "about.html",
  "about-ar.html",
  "services.html",
  "services-ar.html",
  "guide.html",
  "guide-ar.html",
  "blog.html",
  "blog-ar.html",
  "booking.html",
  "booking-ar.html",
  "contact.html",
  "contact-ar.html",
  "destinations-hub.html",
  "destinations-hub-ar.html",
  "tbilisi.html",
  "tbilisi-ar.html",
  "batumi.html",
  "batumi-ar.html",
  "kazbegi.html",
  "kazbegi-ar.html",
  "martvili.html",
  "martvili-ar.html",
  "signagi.html",
  "signagi-ar.html",
  "family-travel-hub.html",
  "family-travel-hub-ar.html",
  "halal-travel-hub.html",
  "halal-travel-hub-ar.html",
  "honeymoon.html",
  "honeymoon-ar.html",
  "itineraries-hub.html",
  "itineraries-hub-ar.html",
  "safety-hub.html",
  "safety-hub-ar.html",
  "ae/index.html",
  "sa/index.html",
  "qa/index.html",
  "kw/index.html",
  "eg/index.html"
];

function listLegacyHtmlCandidates() {
  const rootEntries = fs.readdirSync(ROOT, { withFileTypes: true });
  const files = [];

  for (const entry of rootEntries) {
    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(entry.name);
    }
  }

  for (const market of ["ae", "sa", "qa", "kw", "eg"]) {
    const marketIndex = path.join(ROOT, market, "index.html");
    if (fs.existsSync(marketIndex)) {
      files.push(`${market}/index.html`);
    }
  }

  return files.sort();
}

function walkAstroPages(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAstroPages(full, out);
      continue;
    }
    if (entry.name.endsWith(".astro")) out.push(full);
  }
  return out;
}

function toLegacyHtmlPathFromAstro(file) {
  const rel = path.relative(ASTRO_PAGES_DIR, file).replace(/\\/g, "/");
  if (rel === "index.astro") return "index.html";
  if (rel.endsWith("/index.astro")) {
    return rel.replace(/\.astro$/, ".html");
  }
  return rel.replace(/\.astro$/, ".html");
}

function getDynamicSecondarySlugs() {
  const source = fs.readFileSync(SECONDARY_PAGES_FILE, "utf8");
  const matches = [...source.matchAll(/slug:\s*"([^"]+)"/g)];
  return new Set(matches.map((m) => `${m[1]}.html`));
}

function loadLegacyMap() {
  const json = JSON.parse(fs.readFileSync(LEGACY_MAP_FILE, "utf8"));
  const map = new Map();
  for (const row of json) {
    if (!row || !row.source || !row.destination) continue;
    map.set(String(row.source), {
      destination: String(row.destination),
      reason: String(row.reason || "")
    });
  }
  return map;
}

function main() {
  const legacyFiles = listLegacyHtmlCandidates().filter((file) => !EXCLUDED_LEGACY_HTML.has(file));
  const astroFiles = walkAstroPages(ASTRO_PAGES_DIR);
  const astroStaticCoverage = new Set(
    astroFiles
      .filter((file) => !file.endsWith("[slug].astro") && !file.endsWith("[...slug].astro"))
      .map((file) => toLegacyHtmlPathFromAstro(file))
  );

  const hasDynamicSecondaryPages = astroFiles.some((file) => file.endsWith("[slug].astro"));
  const secondarySlugHtml = hasDynamicSecondaryPages ? getDynamicSecondarySlugs() : new Set();
  const legacyMap = loadLegacyMap();

  const uncovered = [];
  const rows = [];

  for (const legacy of legacyFiles) {
    let status = "uncovered";
    let detail = "";

    if (astroStaticCoverage.has(legacy)) {
      status = "covered-static";
      detail = "astro static page exists";
    } else if (secondarySlugHtml.has(legacy)) {
      status = "covered-dynamic";
      detail = "astro [slug].astro + secondary-pages entry";
    } else if (legacyMap.has(legacy)) {
      const mapping = legacyMap.get(legacy);
      status = "mapped-redirect";
      detail = `${mapping.destination} (${mapping.reason})`;
    }

    rows.push({ legacy, status, detail });
    if (status === "uncovered") uncovered.push(legacy);
  }

  const missingCoreCoverage = CORE_EXPECTED_FILES.filter((file) =>
    rows.every((row) => row.legacy !== file || row.status === "uncovered")
  );

  process.stdout.write("Legacy HTML coverage summary:\n");
  for (const row of rows) {
    process.stdout.write(`- ${row.status.padEnd(15)} ${row.legacy}${row.detail ? ` -> ${row.detail}` : ""}\n`);
  }

  process.stdout.write(`\nTotal legacy candidates: ${rows.length}\n`);
  process.stdout.write(`Uncovered legacy candidates: ${uncovered.length}\n`);

  if (missingCoreCoverage.length) {
    process.stderr.write(`✖ Missing coverage for required core files: ${missingCoreCoverage.join(", ")}\n`);
    process.exit(1);
  }

  if (uncovered.length) {
    process.stderr.write("⚠ Uncovered legacy routes remain (non-core):\n");
    for (const route of uncovered) {
      process.stderr.write(`  - ${route}\n`);
    }
  }

  process.stdout.write("✔ Legacy HTML coverage gate passed for core routes\n");
}

main();
