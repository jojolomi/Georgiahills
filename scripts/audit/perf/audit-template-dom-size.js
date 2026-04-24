#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const targetsPath = path.resolve("scripts/audit/perf/mobile-template-targets.json");
const outPath = path.resolve("scripts/audit/perf/template-dom-size-report.json");

const MAX_NODES_PRIORITY_1 = 2200;

function countElements(html) {
  const matches = html.match(/<([a-zA-Z][a-zA-Z0-9:-]*)\b[^>]*>/g);
  return matches ? matches.length : 0;
}

function countInlineStyles(html) {
  const matches = html.match(/\sstyle\s*=\s*["'][^"']*["']/gi);
  return matches ? matches.length : 0;
}

function countInlineHandlers(html) {
  const matches = html.match(/\son[a-z]+\s*=\s*["'][^"']*["']/gi);
  return matches ? matches.length : 0;
}

function main() {
  if (!fs.existsSync(targetsPath)) {
    process.stderr.write(`✖ missing targets file: ${targetsPath}\n`);
    process.exit(1);
  }

  const targets = JSON.parse(fs.readFileSync(targetsPath, "utf8"));
  const templates = Array.isArray(targets.templates) ? targets.templates : [];

  const reportTemplates = [];
  const breaches = [];

  for (const template of templates) {
    const entry = path.resolve(template.entry);
    if (!fs.existsSync(entry)) continue;

    const html = fs.readFileSync(entry, "utf8");
    const nodeCount = countElements(html);
    const inlineStyleCount = countInlineStyles(html);
    const inlineHandlerCount = countInlineHandlers(html);

    const record = {
      id: template.id,
      family: template.family,
      locale: template.locale,
      entry: template.entry,
      nodeCount,
      inlineStyleCount,
      inlineHandlerCount
    };

    reportTemplates.push(record);

    if (template.priority === 1 && nodeCount > MAX_NODES_PRIORITY_1) {
      breaches.push({
        id: template.id,
        entry: template.entry,
        nodeCount,
        maxAllowed: MAX_NODES_PRIORITY_1
      });
    }
  }

  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        maxNodesPriority1: MAX_NODES_PRIORITY_1,
        templates: reportTemplates,
        breaches
      },
      null,
      2
    )
  );

  process.stdout.write(`✔ DOM size report generated: ${path.relative(process.cwd(), outPath)}\n`);

  if (breaches.length) {
    process.stderr.write("✖ DOM size threshold breaches detected on priority templates:\n");
    for (const breach of breaches) {
      process.stderr.write(`- ${breach.id} (${breach.entry}): ${breach.nodeCount} > ${breach.maxAllowed}\n`);
    }
    process.exit(1);
  }

  for (const row of reportTemplates.filter((item) => {
    const source = templates.find((template) => template.id === item.id);
    return source && source.priority === 1;
  })) {
    process.stdout.write(`- ${row.id}: nodes=${row.nodeCount}, inlineStyles=${row.inlineStyleCount}, inlineHandlers=${row.inlineHandlerCount}\n`);
  }
}

main();
