#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const TARGET_WIDTHS = [320, 640, 1024, 1600];
const TARGET_FORMATS = ["avif", "webp"];
const DEFAULT_INPUT_DIR = path.resolve(process.cwd(), "public", "images");
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function toPosix(inputPath) {
  return inputPath.split(path.sep).join("/");
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

function isVariantFile(filePath) {
  return /-\d+\.(avif|webp)$/i.test(filePath);
}

async function generateVariants(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext) || isVariantFile(filePath)) {
    return [];
  }

  const image = sharp(filePath, { failOn: "none" });
  const metadata = await image.metadata();
  const sourceWidth = metadata.width || 0;

  const widths = TARGET_WIDTHS.filter((width) => width <= sourceWidth);
  if (!widths.length) {
    widths.push(Math.max(320, sourceWidth || 320));
  }

  const parsed = path.parse(filePath);
  const outputs = [];

  for (const width of widths) {
    for (const format of TARGET_FORMATS) {
      const outputPath = path.join(parsed.dir, `${parsed.name}-${width}.${format}`);

      const transformer = sharp(filePath)
        .rotate()
        .resize({ width, withoutEnlargement: true, fit: "inside" });

      if (format === "avif") {
        await transformer.avif({ quality: 60, effort: 4 }).toFile(outputPath);
      } else {
        await transformer.webp({ quality: 78 }).toFile(outputPath);
      }

      outputs.push(outputPath);
    }
  }

  return outputs;
}

async function main() {
  const inputDirArg = process.argv[2];
  const inputDir = inputDirArg ? path.resolve(process.cwd(), inputDirArg) : DEFAULT_INPUT_DIR;

  const exists = await fs.stat(inputDir).then(() => true).catch(() => false);
  if (!exists) {
    console.error(`Input directory not found: ${toPosix(inputDir)}`);
    process.exit(1);
  }

  const files = await walk(inputDir);
  const generated = [];

  for (const filePath of files) {
    const outputs = await generateVariants(filePath);
    generated.push(...outputs);
  }

  console.log(`Generated ${generated.length} responsive variants from ${files.length} source files.`);
  for (const output of generated) {
    console.log(`- ${toPosix(path.relative(process.cwd(), output))}`);
  }
}

main().catch((error) => {
  console.error("Failed to generate responsive images", error);
  process.exit(1);
});
