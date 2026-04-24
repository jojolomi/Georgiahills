#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const targetsPath = path.resolve("scripts/audit/perf/mobile-template-targets.json");
const policyPath = path.resolve("scripts/audit/perf/third-party-governance-policy.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isExternalUrl(url) {
  return /^https?:\/\//i.test(url);
}

function matchesAllowedHost(url, allowedHosts = []) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return allowedHosts.some((allowedHost) => host === String(allowedHost || "").toLowerCase());
  } catch {
    return false;
  }
}

function parseAttribute(tag, name) {
  const match = tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
  return match ? match[1] : "";
}

function isStylesheetTag(tag) {
  return parseAttribute(tag, "rel").toLowerCase() === "stylesheet";
}

function isNonBlockingStylesheet(tag) {
  if (!isStylesheetTag(tag)) return true;
  const media = parseAttribute(tag, "media").toLowerCase();
  const lowered = tag.toLowerCase();
  const mediaSwap = lowered.includes("this.media='all'") || lowered.includes('this.media="all"');
  return media === "print" && mediaSwap;
}

function main() {
  if (!fs.existsSync(targetsPath)) {
    process.stderr.write(`✖ missing targets file: ${targetsPath}\n`);
    process.exit(1);
  }

  if (!fs.existsSync(policyPath)) {
    process.stderr.write(`✖ missing governance policy file: ${policyPath}\n`);
    process.exit(1);
  }

  const targets = readJson(targetsPath);
  const policy = readJson(policyPath);
  const templates = targets.templates || [];
  const allowedBlockingHosts = policy.allowedBlockingHosts || [];

  const issues = [];

  for (const template of templates) {
    const htmlPath = path.resolve(template.entry);
    if (!fs.existsSync(htmlPath)) continue;

    const html = fs.readFileSync(htmlPath, "utf8");
    const head = (html.match(/<head[\s\S]*?<\/head>/i) || [""])[0];

    const scriptTags = Array.from(head.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi));
    const linkTags = Array.from(head.matchAll(/<link\b[^>]*>/gi)).map((match) => match[0]);

    for (const match of scriptTags) {
      const tag = match[0];
      const src = match[1];
      if (!isExternalUrl(src)) continue;

      if (matchesAllowedHost(src, allowedBlockingHosts)) {
        continue;
      }

      const hasAsync = /\basync\b/i.test(tag);
      const hasDefer = /\bdefer\b/i.test(tag);

      if (!hasAsync && !hasDefer) {
        issues.push({
          template: template.id,
          file: template.entry,
          src
        });
      }
    }

    for (const tag of linkTags) {
      const href = parseAttribute(tag, "href");
      if (!isExternalUrl(href)) continue;
      if (!isStylesheetTag(tag)) continue;
      if (matchesAllowedHost(href, allowedBlockingHosts)) continue;

      if (!isNonBlockingStylesheet(tag)) {
        issues.push({
          template: template.id,
          file: template.entry,
          src: href,
          kind: "stylesheet"
        });
      }
    }
  }

  if (issues.length) {
    process.stderr.write("✖ Third-party critical-path governance violations found:\n");
    for (const issue of issues) {
      if (issue.kind === "stylesheet") {
        process.stderr.write(`- ${issue.template} (${issue.file}): ${issue.src} must use non-blocking stylesheet pattern\n`);
      } else {
        process.stderr.write(`- ${issue.template} (${issue.file}): ${issue.src} must be async/defer\n`);
      }
    }
    process.exit(1);
  }

  process.stdout.write(`✔ Third-party governance check passed for ${templates.length} configured templates\n`);
}

main();
