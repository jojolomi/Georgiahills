#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const strictMode = process.argv.includes("--strict");

const IGNORE_FILES = new Set(["admin.html"]);

function collectHtmlFiles() {
  const files = [];

  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".html") && !IGNORE_FILES.has(entry.name)) {
      files.push(path.join(ROOT, entry.name));
    }
  }

  for (const market of ["ae", "sa", "qa", "kw", "eg"]) {
    const marketFile = path.join(ROOT, market, "index.html");
    if (fs.existsSync(marketFile)) files.push(marketFile);
  }

  return files;
}

function parseExternalStyles(html) {
  const links = [...html.matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*>/gi)].map((m) => m[0]);
  return links
    .map((linkTag) => {
      const href = (linkTag.match(/href=["']([^"']+)["']/i) || ["", ""])[1];
      const media = (linkTag.match(/media=["']([^"']+)["']/i) || ["", ""])[1].toLowerCase();
      const lower = linkTag.toLowerCase();
      const hasMediaSwapOnload =
        lower.includes("this.media='all'") ||
        lower.includes('this.media="all"') ||
        lower.includes("this.media = 'all'") ||
        lower.includes('this.media = "all"');
      return { href, media, hasMediaSwapOnload };
    })
    .filter((item) => /^https?:\/\//i.test(item.href));
}

const issues = [];
const files = collectHtmlFiles();

for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const html = fs.readFileSync(file, "utf8");
  const styles = parseExternalStyles(html);

  for (const style of styles) {
    const isNonBlocking = style.media === "print" && style.hasMediaSwapOnload;
    if (isNonBlocking) continue;

    issues.push({
      file: rel,
      href: style.href
    });
  }
}

if (!issues.length) {
  process.stdout.write("✔ no render-blocking external stylesheets detected\n");
  process.exit(0);
}

process.stdout.write("Render-blocking external stylesheet audit:\n");
for (const issue of issues) {
  process.stdout.write(`- ${issue.file}: ${issue.href}\n`);
}

if (strictMode) {
  process.stderr.write(`✖ found ${issues.length} render-blocking external stylesheet references (strict mode)\n`);
  process.exit(1);
}

process.stdout.write(`⚠ found ${issues.length} render-blocking external stylesheet references (non-strict mode)\n`);
