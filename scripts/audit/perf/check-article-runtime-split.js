#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();

const ARTICLE_FILES = [
  "article-7-days-georgia.html",
  "article-7-days-georgia-ar.html",
  "article-georgian-food.html",
  "article-georgian-food-ar.html",
  "article-is-georgia-safe.html",
  "article-is-georgia-safe-ar.html"
];

const REQUIRED_RUNTIME = /<script\s+src=["']destination-script\.js["']\s+defer><\/script>/i;
const DISALLOWED_RUNTIME = /<script\s+src=["']script\.min\.js["']\s+defer><\/script>/i;

const issues = [];

for (const relativeFile of ARTICLE_FILES) {
  const filePath = path.join(ROOT, relativeFile);

  if (!fs.existsSync(filePath)) {
    issues.push(`${relativeFile}: missing file`);
    continue;
  }

  const html = fs.readFileSync(filePath, "utf8");

  if (DISALLOWED_RUNTIME.test(html)) {
    issues.push(`${relativeFile}: still references script.min.js`);
  }

  if (!REQUIRED_RUNTIME.test(html)) {
    issues.push(`${relativeFile}: missing destination-script.js runtime`);
  }
}

if (issues.length > 0) {
  process.stderr.write("✖ Article runtime split guard failed:\n");
  for (const issue of issues) {
    process.stderr.write(`- ${issue}\n`);
  }
  process.exit(1);
}

process.stdout.write(`✔ Article runtime split guard passed (${ARTICLE_FILES.length} files checked)\n`);
