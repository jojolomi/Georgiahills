#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const MARKET_CODES = ["ae", "sa", "qa", "kw", "eg"];
const ROOT_EXCLUDED = new Set(["404.html", "admin.html", "legal.html"]);

function fail(message) {
  process.stderr.write(`✖ ${message}\n`);
}

function ok(message) {
  process.stdout.write(`✔ ${message}\n`);
}

function extractHtmlAttrs(content) {
  const match = content.match(/<html\s+([^>]+)>/i);
  if (!match) return { lang: "", dir: "" };
  const attrs = match[1];
  const lang = (attrs.match(/\blang\s*=\s*['"]([^'"]+)['"]/i) || ["", ""])[1].toLowerCase();
  const dir = (attrs.match(/\bdir\s*=\s*['"]([^'"]+)['"]/i) || ["", ""])[1].toLowerCase();
  return { lang, dir };
}

function listRootHtmlFiles() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html") && !ROOT_EXCLUDED.has(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function expectedLocaleForFile(fileName) {
  if (fileName === "arabic.html" || fileName.endsWith("-ar.html")) {
    return { lang: "ar", dir: "rtl" };
  }
  return { lang: "en", dir: "ltr" };
}

function main() {
  let passed = true;
  const rootHtmlFiles = listRootHtmlFiles();
  const rootFileSet = new Set(rootHtmlFiles);

  for (const fileName of rootHtmlFiles) {
    const fullPath = path.join(ROOT, fileName);
    const content = fs.readFileSync(fullPath, "utf8");
    const { lang, dir } = extractHtmlAttrs(content);
    const expected = expectedLocaleForFile(fileName);

    if (lang !== expected.lang) {
      fail(`${fileName}: expected <html lang=\"${expected.lang}\">, found \"${lang || "missing"}\"`);
      passed = false;
    }
    if (dir !== expected.dir) {
      fail(`${fileName}: expected <html dir=\"${expected.dir}\">, found \"${dir || "missing"}\"`);
      passed = false;
    }

    if (fileName.endsWith("-ar.html")) {
      const enPair = fileName.replace(/-ar\.html$/, ".html");
      if (!rootFileSet.has(enPair)) {
        fail(`${fileName}: missing English pair ${enPair}`);
        passed = false;
      }
    } else if (fileName !== "index.html" && fileName !== "arabic.html") {
      const arPair = fileName.replace(/\.html$/, "-ar.html");
      if (rootFileSet.has(arPair)) {
        ok(`${fileName}: paired with ${arPair}`);
      }
    }
  }

  for (const market of MARKET_CODES) {
    const marketIndex = path.join(ROOT, market, "index.html");
    if (!fs.existsSync(marketIndex)) {
      fail(`${market}/index.html is missing`);
      passed = false;
      continue;
    }
    const content = fs.readFileSync(marketIndex, "utf8");
    const { lang, dir } = extractHtmlAttrs(content);
    if (lang !== "ar") {
      fail(`${market}/index.html: expected lang=\"ar\", found \"${lang || "missing"}\"`);
      passed = false;
    }
    if (dir !== "rtl") {
      fail(`${market}/index.html: expected dir=\"rtl\", found \"${dir || "missing"}\"`);
      passed = false;
    }
  }

  if (!passed) {
    process.exit(1);
  }

  ok("locale/rtl parity checks passed");
}

main();
