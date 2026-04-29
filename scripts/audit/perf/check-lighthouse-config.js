#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const configPath = path.resolve(process.argv[2] || ".lighthouserc.json");

const requiredUrls = [
  "http://127.0.0.1:3000/en",
  "http://127.0.0.1:3000/ar",
  "http://127.0.0.1:3000/booking",
  "http://127.0.0.1:3000/en/destinations/tbilisi"
];

const requiredThresholds = {
  performanceMin: 0.60,
  accessibilityMin: 0.9,
  seoMin: 0.9,
  lcpMax: 4500,
  clsMax: 0.1
};

function fail(message) {
  process.stderr.write(`✖ ${message}\n`);
}

function ok(message) {
  process.stdout.write(`✔ ${message}\n`);
}

if (!fs.existsSync(configPath)) {
  fail(`Lighthouse config not found: ${configPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(configPath, "utf8");
let config;

try {
  config = JSON.parse(raw);
} catch (error) {
  fail(`Invalid JSON in ${configPath}: ${error.message}`);
  process.exit(1);
}

const urls = config?.ci?.collect?.url;
const assertions = config?.ci?.assert?.assertions || {};

let passed = true;

if (!Array.isArray(urls)) {
  fail("ci.collect.url must be an array");
  process.exit(1);
}

for (const url of requiredUrls) {
  if (!urls.includes(url)) {
    fail(`Missing required Lighthouse URL: ${url}`);
    passed = false;
  }
}

const perfRule = assertions["categories:performance"];
const a11yRule = assertions["categories:accessibility"];
const seoRule = assertions["categories:seo"];
const lcpRule = assertions["largest-contentful-paint"];
const clsRule = assertions["cumulative-layout-shift"];

function readMinScore(rule) {
  return Array.isArray(rule) && rule[1] && typeof rule[1].minScore === "number" ? rule[1].minScore : null;
}

function readMaxValue(rule) {
  return Array.isArray(rule) && rule[1] && typeof rule[1].maxNumericValue === "number" ? rule[1].maxNumericValue : null;
}

const perfMin = readMinScore(perfRule);
const a11yMin = readMinScore(a11yRule);
const seoMin = readMinScore(seoRule);
const lcpMax = readMaxValue(lcpRule);
const clsMax = readMaxValue(clsRule);

if (perfMin === null || perfMin < requiredThresholds.performanceMin) {
  fail(`categories:performance minScore must be >= ${requiredThresholds.performanceMin}`);
  passed = false;
}
if (a11yMin === null || a11yMin < requiredThresholds.accessibilityMin) {
  fail(`categories:accessibility minScore must be >= ${requiredThresholds.accessibilityMin}`);
  passed = false;
}
if (seoMin === null || seoMin < requiredThresholds.seoMin) {
  fail(`categories:seo minScore must be >= ${requiredThresholds.seoMin}`);
  passed = false;
}
if (lcpMax === null || lcpMax > requiredThresholds.lcpMax) {
  fail(`largest-contentful-paint maxNumericValue must be <= ${requiredThresholds.lcpMax}`);
  passed = false;
}
if (clsMax === null || clsMax > requiredThresholds.clsMax) {
  fail(`cumulative-layout-shift maxNumericValue must be <= ${requiredThresholds.clsMax}`);
  passed = false;
}

if (!passed) {
  process.exit(1);
}

ok("Lighthouse config guardrails passed");
