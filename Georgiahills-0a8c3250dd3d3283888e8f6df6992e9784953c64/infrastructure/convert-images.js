/*
  Bulk image conversion pipeline for apps/web public assets.
  - Copies discovered source files into /apps/web/public/images/originals/
  - Generates AVIF files into /apps/web/public/images/optimized/

  Run:
    pnpm images:convert
*/

const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const REPO_ROOT = path.resolve(__dirname, "..");
const WEB_PUBLIC = path.join(REPO_ROOT, "apps", "web", "public");
const ORIGINALS_DIR = path.join(WEB_PUBLIC, "images", "originals");
const OPTIMIZED_DIR = path.join(WEB_PUBLIC, "images", "optimized");

const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const SKIP_DIRS = new Set(["images\\originals", "images\\optimized", ".next", "node_modules"]);

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function walk(dirPath, fileList = []) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativeToPublic = path.relative(WEB_PUBLIC, fullPath);

    if (entry.isDirectory()) {
      if ([...SKIP_DIRS].some((segment) => relativeToPublic.includes(segment))) {
        continue;
      }
      await walk(fullPath, fileList);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (SOURCE_EXTENSIONS.has(ext)) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

async function run() {
  await ensureDir(ORIGINALS_DIR);
  await ensureDir(OPTIMIZED_DIR);

  const sourceFiles = await walk(WEB_PUBLIC);

  if (!sourceFiles.length) {
    console.log("No source images found.");
    return;
  }

  let converted = 0;

  for (const sourcePath of sourceFiles) {
    const relative = path.relative(WEB_PUBLIC, sourcePath);
    const parsed = path.parse(relative);

    const originalTarget = path.join(ORIGINALS_DIR, relative);
    const optimizedTarget = path.join(OPTIMIZED_DIR, `${parsed.dir ? `${parsed.dir}${path.sep}` : ""}${parsed.name}.avif`);

    await ensureDir(path.dirname(originalTarget));
    await ensureDir(path.dirname(optimizedTarget));

    await fs.copyFile(sourcePath, originalTarget);

    await sharp(sourcePath)
      .rotate()
      .avif({ quality: 55, effort: 6 })
      .toFile(optimizedTarget);

    converted += 1;
  }

  console.log(`Converted ${converted} image(s) to AVIF.`);
  console.log(`Originals: ${ORIGINALS_DIR}`);
  console.log(`Optimized: ${OPTIMIZED_DIR}`);
}

run().catch((error) => {
  console.error("Image conversion failed:", error);
  process.exit(1);
});