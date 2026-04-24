#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();

const IGNORE_PATH_PATTERNS = [
  `${path.sep}last_version${path.sep}`,
  `${path.sep}artifacts${path.sep}`,
  `${path.sep}lhr-prod-final`,
  `${path.sep}admin-v3${path.sep}`
];

const DIRECT_ISSUES = [
  { label: "style.css reference", regex: /href=["'](?:\.\/)?style\.css["']/i },
  { label: "../style.css reference", regex: /href=["']\.\.\/style\.css["']/i },
  { label: "script.js reference", regex: /src=["'](?:\.\/)?script\.js["']/i },
  { label: "../script.js reference", regex: /src=["']\.\.\/script\.js["']/i }
];

function shouldSkip(fullPath) {
  const normalized = fullPath.replace(/\//g, path.sep);
  return IGNORE_PATH_PATTERNS.some((pattern) => normalized.includes(pattern));
}

function collectHtmlFiles(dir, output = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (shouldSkip(fullPath)) continue;

    if (entry.isDirectory()) {
      collectHtmlFiles(fullPath, output);
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      output.push(fullPath);
    }
  }

  return output;
}

function main() {
  const files = collectHtmlFiles(ROOT);
  const findings = [];

  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    for (const issue of DIRECT_ISSUES) {
      if (issue.regex.test(html)) {
        findings.push({
          file: path.relative(ROOT, file).replace(/\\/g, "/"),
          issue: issue.label
        });
      }
    }
  }

  if (findings.length > 0) {
    process.stderr.write("✖ Non-minified legacy asset references detected:\n");
    for (const finding of findings) {
      process.stderr.write(`- ${finding.file}: ${finding.issue}\n`);
    }
    process.exit(1);
  }

  process.stdout.write(`✔ Legacy HTML files reference minified style/script assets (${files.length} files checked)\n`);
}

main();
