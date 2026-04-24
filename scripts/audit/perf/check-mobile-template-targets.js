#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const targetsPath = path.resolve(
  process.argv[2] || "scripts/audit/perf/mobile-template-targets.json"
);

const lighthouseConfigPath = path.resolve(
  process.argv[3] || ".lighthouserc.json"
);

const requiredFamilies = ["home", "booking", "destination", "blog", "article"];
const requiredProfile = "mobile";

function fail(message) {
  process.stderr.write(`✖ ${message}\n`);
}

function ok(message) {
  process.stdout.write(`✔ ${message}\n`);
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
  }
}

let targets;
let lhci;

try {
  targets = readJson(targetsPath);
  lhci = readJson(lighthouseConfigPath);
} catch (error) {
  fail(error.message);
  process.exit(1);
}

const profile = targets?.profiles?.[requiredProfile];
const templates = Array.isArray(targets?.templates) ? targets.templates : [];

let passed = true;

if (!profile) {
  fail(`Missing profile '${requiredProfile}' in ${targetsPath}`);
  process.exit(1);
}

const budgetKeys = ["lcpMs", "cls", "inpMs", "tbtMs", "jsKb", "cssKb", "totalKb"];
for (const key of budgetKeys) {
  if (typeof profile?.budgets?.[key] !== "number") {
    fail(`profiles.${requiredProfile}.budgets.${key} must be a number`);
    passed = false;
  }
}

if (!templates.length) {
  fail("templates[] must not be empty");
  passed = false;
}

const existingEntries = new Set();
for (const template of templates) {
  if (!template?.id || typeof template.id !== "string") {
    fail("Each template must include a string id");
    passed = false;
    continue;
  }

  if (existingEntries.has(template.id)) {
    fail(`Duplicate template id: ${template.id}`);
    passed = false;
  }
  existingEntries.add(template.id);

  if (!template.family || typeof template.family !== "string") {
    fail(`Template ${template.id} must include a family`);
    passed = false;
  }

  if (!template.entry || typeof template.entry !== "string") {
    fail(`Template ${template.id} must include an entry file`);
    passed = false;
  }

  if (!fs.existsSync(path.resolve(template.entry))) {
    fail(`Template ${template.id} entry file not found: ${template.entry}`);
    passed = false;
  }

  if (typeof template.priority !== "number" || template.priority < 1 || template.priority > 3) {
    fail(`Template ${template.id} priority must be 1..3`);
    passed = false;
  }
}

for (const family of requiredFamilies) {
  if (!templates.some((template) => template.family === family)) {
    fail(`Missing required template family: ${family}`);
    passed = false;
  }
}

const lhciUrls = new Set(Array.isArray(lhci?.ci?.collect?.url) ? lhci.ci.collect.url : []);
for (const template of templates.filter((item) => item.priority === 1)) {
  if (!template.lighthouseUrl || template.lighthouseUrl === "pending") {
    fail(`Priority-1 template ${template.id} must include lighthouseUrl`);
    passed = false;
    continue;
  }

  if (!lhciUrls.has(template.lighthouseUrl)) {
    fail(`Priority-1 template ${template.id} lighthouseUrl missing from .lighthouserc.json: ${template.lighthouseUrl}`);
    passed = false;
  }
}

if (!passed) {
  process.exit(1);
}

ok(`Mobile template targets are valid (${templates.length} templates)`);
ok("Priority-1 templates are wired to Lighthouse collection URLs");
