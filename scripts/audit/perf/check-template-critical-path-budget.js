#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const targetsPath = path.resolve("scripts/audit/perf/mobile-template-targets.json");
const reportPath = path.resolve("scripts/audit/perf/template-critical-path-report.json");

const MAX_INLINE_SCRIPTS_PRIORITY1 = 5;

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

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function main() {
  let targets;
  let report;

  try {
    targets = readJson(targetsPath);
    report = readJson(reportPath);
  } catch (error) {
    fail(error.message);
    process.exit(1);
  }

  const templates = Array.isArray(targets.templates) ? targets.templates : [];
  const byId = new Map((Array.isArray(report.templates) ? report.templates : []).map((item) => [item.id, item]));
  const priorityOne = templates.filter((template) => template.priority === 1);

  let passed = true;

  for (const template of priorityOne) {
    const metrics = byId.get(template.id);
    if (!metrics) {
      fail(`Missing critical-path metrics for template: ${template.id}`);
      passed = false;
      continue;
    }

    if ((metrics.links?.blockingStylesheets || 0) > 0) {
      fail(`${template.id}: blockingStylesheets must be 0 (found ${metrics.links.blockingStylesheets})`);
      passed = false;
    }

    if ((metrics.scripts?.inline || 0) > MAX_INLINE_SCRIPTS_PRIORITY1) {
      fail(
        `${template.id}: inline scripts exceed budget ${MAX_INLINE_SCRIPTS_PRIORITY1} (found ${metrics.scripts.inline})`
      );
      passed = false;
    }

    if ((metrics.scripts?.deferredExternal || 0) !== (metrics.scripts?.external || 0)) {
      fail(
        `${template.id}: all external scripts must be deferred (deferred ${metrics.scripts.deferredExternal}/${metrics.scripts.external})`
      );
      passed = false;
    }

    const requiresHeroPreload = template.family === "home" || template.family === "destination";
    if (requiresHeroPreload && !metrics.flags?.hasHighPriorityImagePreload) {
      fail(`${template.id}: missing high-priority image preload for critical hero path`);
      passed = false;
    }
  }

  if (!passed) {
    process.exit(1);
  }

  ok(`Critical-path budget guard passed for ${priorityOne.length} priority templates`);
}

main();
