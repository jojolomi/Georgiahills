#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const configPath = path.resolve("netlify.toml");

const requiredRules = [
  { target: '/script.min.js', token: 'immutable' },
  { target: '/style.min.css', token: 'immutable' },
  { target: '/destination-script.js', token: 'immutable' },
  { target: '/*.html', token: 'must-revalidate' }
];

if (!fs.existsSync(configPath)) {
  process.stderr.write(`✖ Missing file: ${configPath}\n`);
  process.exit(1);
}

const content = fs.readFileSync(configPath, "utf8");

let passed = true;
for (const rule of requiredRules) {
  const blockRegex = new RegExp(String.raw`\[\[headers\]\][\s\S]*?for\s*=\s*"${rule.target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\s\S]*?\[headers\.values\][\s\S]*?Cache-Control\s*=\s*"([^"]+)"`, "i");
  const match = content.match(blockRegex);

  if (!match) {
    process.stderr.write(`✖ Missing cache rule for ${rule.target}\n`);
    passed = false;
    continue;
  }

  const value = match[1].toLowerCase();
  if (!value.includes(rule.token.toLowerCase())) {
    process.stderr.write(`✖ Cache-Control for ${rule.target} must include '${rule.token}'\n`);
    passed = false;
  }
}

if (!passed) {
  process.exit(1);
}

process.stdout.write("✔ Netlify cache policy guard passed\n");
