/**
 * prepare-seo-dist.js
 *
 * After `next build`, pre-rendered HTML lives inside
 * apps/web/.next/server/app (App Router) and apps/web/.next/server/pages
 * (Pages Router).  The SEO validation scripts expect a flat `apps/web/dist`
 * directory that mirrors the public URL space.
 *
 * This script copies those HTML files (plus the _next/static assets so that
 * check-broken-links.js can resolve references) into apps/web/dist.
 */

const fs = require("fs");
const path = require("path");

const webRoot = path.resolve(__dirname, "..", "apps", "web");
const nextDir = path.join(webRoot, ".next");
const distDir = path.join(webRoot, "dist");

/* ── helpers ───────────────────────────────────────────────────────── */

function copyRecursive(src, dest, filter) {
  if (!fs.existsSync(src)) return;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath, filter);
    } else if (!filter || filter(entry.name, srcPath)) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/* ── guard ─────────────────────────────────────────────────────────── */

if (!fs.existsSync(nextDir)) {
  process.stderr.write(`✖ .next directory not found – run 'next build' first\n`);
  process.exit(1);
}

/* ── clean ─────────────────────────────────────────────────────────── */

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

/* ── 1. Copy pre-rendered HTML from .next/server/app ──────────────── */

const appDir = path.join(nextDir, "server", "app");
const skipFiles = new Set(["_not-found.html", "_not-found.js"]);

copyRecursive(appDir, distDir, (name) => {
  if (skipFiles.has(name)) return false;
  return name.endsWith(".html");
});

/* ── 2. Copy pre-rendered HTML from .next/server/pages ────────────── */

const pagesDir = path.join(nextDir, "server", "pages");
copyRecursive(pagesDir, distDir, (name) => name.endsWith(".html"));

/* ── 3. Copy _next/static so that asset references resolve ────────── */

const staticSrc = path.join(nextDir, "static");
const staticDest = path.join(distDir, "_next", "static");
copyRecursive(staticSrc, staticDest);

/* ── 4. Copy public/ files so that image / manifest references resolve */

const publicDir = path.join(webRoot, "public");
copyRecursive(publicDir, distDir, (name) => {
  // skip dotfiles
  return !name.startsWith(".");
});

/* ── 5. Copy legacy market pages that haven't migrated to Next.js yet */

const repoRoot = path.resolve(__dirname, "..");
const markets = ["ae", "sa", "qa", "kw", "eg"];
for (const market of markets) {
  const src = path.join(repoRoot, market);
  if (fs.existsSync(src)) {
    copyRecursive(src, path.join(distDir, market), (name) => name.endsWith(".html"));
  }
}

/* ── report ────────────────────────────────────────────────────────── */

function countFiles(dir, ext) {
  let n = 0;
  if (!fs.existsSync(dir)) return n;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      n += countFiles(full, ext);
    } else if (!ext || entry.name.endsWith(ext)) {
      n++;
    }
  }
  return n;
}

const htmlCount = countFiles(distDir, ".html");
process.stdout.write(`✔ prepared dist with ${htmlCount} HTML pages\n`);
