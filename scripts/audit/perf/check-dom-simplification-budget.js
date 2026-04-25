#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const reportPath = path.resolve("scripts/audit/perf/template-dom-size-report.json");
const budgetsPath = path.resolve("scripts/audit/perf/dom-simplification-budgets.json");

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function main() {
  let report;
  let budgets;

  try {
    report = readJson(reportPath);
    budgets = readJson(budgetsPath);
  } catch (error) {
    process.stderr.write(`✖ ${error.message}\n`);
    process.exit(1);
  }

  const budgetTemplates = budgets.templates || {};
  const reportTemplates = Array.isArray(report.templates) ? report.templates : [];
  const reportById = new Map(reportTemplates.map((item) => [item.id, item]));

  const issues = [];

  for (const [templateId, budget] of Object.entries(budgetTemplates)) {
    const metrics = reportById.get(templateId);
    if (!metrics) {
      issues.push(`${templateId}: missing metrics in template-dom-size-report.json`);
      continue;
    }

    if (metrics.nodeCount > budget.maxNodes) {
      issues.push(`${templateId}: nodeCount ${metrics.nodeCount} > maxNodes ${budget.maxNodes}`);
    }
    if (metrics.inlineStyleCount > budget.maxInlineStyles) {
      issues.push(
        `${templateId}: inlineStyleCount ${metrics.inlineStyleCount} > maxInlineStyles ${budget.maxInlineStyles}`
      );
    }
    if (metrics.inlineHandlerCount > budget.maxInlineHandlers) {
      issues.push(
        `${templateId}: inlineHandlerCount ${metrics.inlineHandlerCount} > maxInlineHandlers ${budget.maxInlineHandlers}`
      );
    }
  }

  if (issues.length > 0) {
    process.stderr.write("✖ DOM simplification budget check failed:\n");
    for (const issue of issues) {
      process.stderr.write(`- ${issue}\n`);
    }
    process.exit(1);
  }

  process.stdout.write(`✔ DOM simplification budgets passed (${Object.keys(budgetTemplates).length} templates)\n`);
}

main();
