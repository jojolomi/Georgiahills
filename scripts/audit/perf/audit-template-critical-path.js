#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const targetsPath = path.resolve("scripts/audit/perf/mobile-template-targets.json");
const outPath = path.resolve("scripts/audit/perf/template-critical-path-report.json");

function parseTags(content, regex) {
  return Array.from(content.matchAll(regex)).map((match) => match[0]);
}

function hasAttribute(tag, attrName, attrValue) {
  const value = (tag.match(new RegExp(`${attrName}=[\"']([^\"']+)[\"']`, "i")) || [])[1];
  if (typeof attrValue === "undefined") return Boolean(value);
  return (value || "").toLowerCase() === String(attrValue).toLowerCase();
}

function getAttribute(tag, attrName) {
  return (tag.match(new RegExp(`${attrName}=[\"']([^\"']+)[\"']`, "i")) || [])[1] || "";
}

function countBlockingStylesheetLinks(linkTags) {
  return linkTags.filter((tag) => {
    const rel = getAttribute(tag, "rel").toLowerCase();
    if (rel !== "stylesheet") return false;

    const media = getAttribute(tag, "media").toLowerCase();
    const lowered = tag.toLowerCase();
    const mediaSwap = lowered.includes("this.media='all'") || lowered.includes('this.media="all"');

    return !(media === "print" && mediaSwap);
  }).length;
}

function analyzeTemplate(template) {
  const entryPath = path.resolve(template.entry);
  const content = fs.readFileSync(entryPath, "utf8");
  const contentWithoutNoscript = content.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");

  const scriptTags = parseTags(contentWithoutNoscript, /<script\b[^>]*>/gi);
  const externalScriptTags = scriptTags.filter((tag) => hasAttribute(tag, "src"));
  const inlineScriptTags = scriptTags.filter((tag) => !hasAttribute(tag, "src"));

  const deferredExternalScripts = externalScriptTags.filter((tag) => /\bdefer\b/i.test(tag));

  const linkTags = parseTags(contentWithoutNoscript, /<link\b[^>]*>/gi);
  const preloadImageLinks = linkTags.filter((tag) => {
    return getAttribute(tag, "rel").toLowerCase() === "preload" && getAttribute(tag, "as").toLowerCase() === "image";
  });

  const preconnectLinks = linkTags.filter((tag) => getAttribute(tag, "rel").toLowerCase() === "preconnect");
  const blockingStyles = countBlockingStylesheetLinks(linkTags);

  const hasHighPriorityPreload = preloadImageLinks.some((tag) => /fetchpriority=["']high["']/i.test(tag));
  const hasLoadingPlaceholder = /Loading\.\.\.|Loading destination details/i.test(content);

  return {
    id: template.id,
    family: template.family,
    locale: template.locale,
    entry: template.entry,
    htmlKb: Number((Buffer.byteLength(content, "utf8") / 1024).toFixed(1)),
    scripts: {
      total: scriptTags.length,
      inline: inlineScriptTags.length,
      external: externalScriptTags.length,
      deferredExternal: deferredExternalScripts.length
    },
    links: {
      total: linkTags.length,
      preconnect: preconnectLinks.length,
      preloadImages: preloadImageLinks.length,
      blockingStylesheets: blockingStyles
    },
    flags: {
      hasHighPriorityImagePreload: hasHighPriorityPreload,
      hasLoadingPlaceholderText: hasLoadingPlaceholder
    }
  };
}

function main() {
  if (!fs.existsSync(targetsPath)) {
    process.stderr.write(`✖ missing targets file: ${targetsPath}\n`);
    process.exit(1);
  }

  const targets = JSON.parse(fs.readFileSync(targetsPath, "utf8"));
  const templates = Array.isArray(targets.templates) ? targets.templates : [];

  const report = {
    generatedAt: new Date().toISOString(),
    templates: templates.map(analyzeTemplate)
  };

  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  process.stdout.write(`✔ critical-path report generated: ${path.relative(process.cwd(), outPath)}\n`);

  const priorityOne = report.templates.filter((template) => {
    const source = templates.find((item) => item.id === template.id);
    return source && source.priority === 1;
  });

  for (const template of priorityOne) {
    process.stdout.write(
      `- ${template.id}: html=${template.htmlKb}KB, blockingCss=${template.links.blockingStylesheets}, inlineScripts=${template.scripts.inline}, imagePreload=${template.links.preloadImages}\n`
    );
  }
}

main();
