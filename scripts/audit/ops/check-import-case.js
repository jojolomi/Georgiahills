#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const SOURCE_ROOT = path.resolve(process.cwd(), process.argv[2] || "admin-v3/src");
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);

function listSourceFiles(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listSourceFiles(fullPath, acc);
      continue;
    }
    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      acc.push(fullPath);
    }
  }
  return acc;
}

function splitPathSegments(absPath) {
  const normalized = path.resolve(absPath);
  const parsed = path.parse(normalized);
  const withoutRoot = normalized.slice(parsed.root.length);
  const segments = withoutRoot.split(path.sep).filter(Boolean);
  return { root: parsed.root, segments };
}

function existsWithExactCase(absPath) {
  const resolvedPath = path.resolve(absPath);
  if (!fs.existsSync(resolvedPath)) {
    return false;
  }

  const { root, segments } = splitPathSegments(resolvedPath);
  let current = root;

  for (const segment of segments) {
    let children;
    try {
      children = fs.readdirSync(current);
    } catch {
      return false;
    }

    if (!children.includes(segment)) {
      return false;
    }

    current = path.join(current, segment);
  }

  return true;
}

function candidatePaths(importerFile, specifier) {
  const basePath = path.resolve(path.dirname(importerFile), specifier);

  if (path.extname(basePath)) {
    return [basePath];
  }

  const exts = Array.from(SOURCE_EXTENSIONS);
  const candidates = [];

  for (const ext of exts) {
    candidates.push(basePath + ext);
  }

  for (const ext of exts) {
    candidates.push(path.join(basePath, "index" + ext));
  }

  return candidates;
}

function parseRelativeSpecifiers(fileContent) {
  const specifiers = [];

  // Covers import ... from "...", export ... from "...", and dynamic import("...").
  const importExportRegex = /\b(?:import|export)\s+(?:[^"'`]*?\s+from\s+)?["']([^"']+)["']/g;
  const dynamicImportRegex = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;

  let match;
  while ((match = importExportRegex.exec(fileContent)) !== null) {
    if (match[1].startsWith(".")) {
      specifiers.push(match[1]);
    }
  }

  while ((match = dynamicImportRegex.exec(fileContent)) !== null) {
    if (match[1].startsWith(".")) {
      specifiers.push(match[1]);
    }
  }

  return specifiers;
}

function main() {
  if (!fs.existsSync(SOURCE_ROOT) || !fs.statSync(SOURCE_ROOT).isDirectory()) {
    console.error(`Import case check failed: directory not found: ${SOURCE_ROOT}`);
    process.exit(1);
  }

  const files = listSourceFiles(SOURCE_ROOT);
  const failures = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8");
    const specifiers = parseRelativeSpecifiers(content);

    for (const specifier of specifiers) {
      const candidates = candidatePaths(filePath, specifier);
      const hasAnyPath = candidates.some((candidate) => fs.existsSync(candidate));
      const hasExactPath = candidates.some((candidate) => existsWithExactCase(candidate));

      if (hasAnyPath && !hasExactPath) {
        failures.push({ filePath, specifier });
      }
    }
  }

  if (failures.length > 0) {
    console.error("Import case check failed. Fix path casing to match on-disk filenames:");
    for (const failure of failures) {
      const relFile = path.relative(process.cwd(), failure.filePath).replace(/\\/g, "/");
      console.error(`- ${relFile}: ${failure.specifier}`);
    }
    process.exit(1);
  }

  console.log(`Import case check passed for ${files.length} files in ${path.relative(process.cwd(), SOURCE_ROOT).replace(/\\/g, "/")}.`);
}

main();
