#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();

const requiredFiles = [
  "MONOREPO_MIGRATION_PLAN.md",
  "PERF_MOBILE_ROADMAP.md",
  ".github/workflows/firebase-preview.yml",
  ".github/workflows/firebase-production.yml",
  "scripts/audit/perf/check-article-runtime-split.js",
  "scripts/audit/perf/check-blog-runtime-split.js",
  "scripts/audit/perf/check-dom-simplification-budget.js",
  "scripts/audit/ops/check-delivery-slo.js"
];

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function main() {
  const issues = [];

  for (const relativePath of requiredFiles) {
    const fullPath = path.join(root, relativePath);
    if (!fs.existsSync(fullPath)) {
      issues.push(`missing required artifact: ${relativePath}`);
    }
  }

  const packageJson = JSON.parse(readText("package.json"));
  const scripts = packageJson.scripts || {};

  const preflight = String(scripts["preflight:pr"] || "");
  const requiredPreflightTokens = [
    "perf:article-runtime-split",
    "perf:blog-runtime-split",
    "perf:dom-budget"
  ];

  for (const token of requiredPreflightTokens) {
    if (!preflight.includes(token)) {
      issues.push(`preflight:pr missing ${token}`);
    }
  }

  const stagingWorkflow = readText(".github/workflows/firebase-preview.yml");
  if (!stagingWorkflow.includes("check-delivery-slo.js")) {
    issues.push("staging workflow missing delivery SLO check");
  }

  const productionWorkflow = readText(".github/workflows/firebase-production.yml");
  if (!productionWorkflow.includes("check-delivery-slo.js")) {
    issues.push("production workflow missing delivery SLO checks");
  }

  const roadmap = readText("PERF_MOBILE_ROADMAP.md");
  const requiredStatusMarkers = [
    "5. Route-level JS separation and runtime slimming",
    "7. HTML and DOM simplification",
    "10. Architecture cleanup last"
  ];

  for (const marker of requiredStatusMarkers) {
    if (!roadmap.includes(marker)) {
      issues.push(`roadmap missing section: ${marker}`);
    }
  }

  if (issues.length > 0) {
    process.stderr.write("✖ Architecture cleanup readiness check failed:\n");
    for (const issue of issues) {
      process.stderr.write(`- ${issue}\n`);
    }
    process.exit(1);
  }

  process.stdout.write("✔ Architecture cleanup readiness check passed\n");
}

main();
