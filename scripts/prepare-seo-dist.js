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

function isExternalLink(target) {
  return /^(https?:|mailto:|tel:|#)/i.test(target);
}

function normalizeLocalTarget(target) {
  if (!target) return "";
  const withoutQuery = target.split("?")[0].split("#")[0];
  return withoutQuery.replace(/^\/+/, "");
}

function extractLocalTargetsFromHtml(html) {
  const localTargets = new Set();
  const attrRegex = /(href|src)="([^"]+)"/gi;
  let match = null;

  while ((match = attrRegex.exec(html)) !== null) {
    const rawTarget = match[2].trim();
    if (isExternalLink(rawTarget)) continue;
    const normalized = normalizeLocalTarget(rawTarget);
    if (!normalized) continue;
    localTargets.add(normalized);
  }

  return localTargets;
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

/* ── 3b. Copy metadata route bodies (favicon, robots, sitemap) ─────── */

const metadataBodies = [
  { src: path.join(appDir, "favicon.ico.body"), dest: path.join(distDir, "favicon.ico") },
  { src: path.join(appDir, "robots.txt.body"), dest: path.join(distDir, "robots.txt") },
  { src: path.join(appDir, "sitemap.xml.body"), dest: path.join(distDir, "sitemap.xml") }
];

for (const file of metadataBodies) {
  if (fs.existsSync(file.src)) {
    fs.mkdirSync(path.dirname(file.dest), { recursive: true });
    fs.copyFileSync(file.src, file.dest);
  }
}

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
  const distMarketPath = path.join(distDir, market);
  if (fs.existsSync(distMarketPath)) {
    continue;
  }

  const src = path.join(repoRoot, market);
  if (fs.existsSync(src)) {
    copyRecursive(src, distMarketPath, (name) => name.endsWith(".html"));
  }
}

/* ── 6. Resolve root redirect shell for static hosting (GitHub Pages) ─ */

const indexHtmlPath = path.join(distDir, "index.html");
const enHtmlPath = path.join(distDir, "en.html");

if (fs.existsSync(indexHtmlPath) && fs.existsSync(enHtmlPath)) {
  const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
  if (indexHtml.includes("NEXT_REDIRECT")) {
    fs.copyFileSync(enHtmlPath, indexHtmlPath);
  }
}

/* ── 7. GitHub Pages fail-safe root homepage ──────────────────────── */

if (process.env.GITHUB_PAGES === "true" && !fs.existsSync(indexHtmlPath)) {
  const owner = (process.env.GITHUB_REPOSITORY_OWNER || "").toLowerCase();
  const repository = process.env.GITHUB_REPOSITORY || "";
  const repoName = repository.split("/")[1] || "";
  const isUserSite = repoName && repoName.toLowerCase() === `${owner}.github.io`;
  const base = !repoName || isUserSite ? "" : `/${repoName}`;

  const safeIndex = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Georgia Hills</title>
  <meta name="description" content="Georgia Hills private tours and driver service." />
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #f8fafc; color: #0f172a; }
    main { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
    section { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; max-width: 560px; width: 100%; box-sizing: border-box; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    p { margin: 0 0 16px; line-height: 1.5; color: #334155; }
    a { display: inline-block; text-decoration: none; background: #0f172a; color: #fff; padding: 10px 14px; border-radius: 10px; font-weight: 600; }
  </style>
</head>
<body>
  <main>
    <section>
      <h1>Georgia Hills</h1>
      <p>Private tours and driver service in Georgia.</p>
      <a href="${base}/en">Enter Website</a>
    </section>
  </main>
</body>
</html>`;

  fs.writeFileSync(indexHtmlPath, safeIndex, "utf8");
}

/* ── 8. Fallback to legacy root homepage only if dist still lacks one ─ */

const legacyRootIndexPath = path.join(repoRoot, "index.html");
if (!fs.existsSync(indexHtmlPath) && fs.existsSync(legacyRootIndexPath)) {
  fs.copyFileSync(legacyRootIndexPath, indexHtmlPath);

  const legacyIndex = fs.readFileSync(legacyRootIndexPath, "utf8");
  const localTargets = extractLocalTargetsFromHtml(legacyIndex);

  for (const target of localTargets) {
    const srcPath = path.join(repoRoot, target);
    const destPath = path.join(distDir, target);
    if (!fs.existsSync(srcPath)) continue;

    if (fs.statSync(srcPath).isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }

  const legacyTopLevelExtensions = new Set([
    ".js",
    ".css",
    ".webp",
    ".avif",
    ".ico",
    ".xml",
    ".txt",
    ".json"
  ]);

  for (const entry of fs.readdirSync(repoRoot, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!legacyTopLevelExtensions.has(ext)) continue;

    const srcPath = path.join(repoRoot, entry.name);
    const destPath = path.join(distDir, entry.name);
    if (fs.existsSync(destPath)) continue;
    fs.copyFileSync(srcPath, destPath);
  }

  // Recursively copy only linked legacy HTML pages so internal links resolve
  // without reintroducing unrelated root artifacts (reports, temp files, admin).
  const htmlQueue = [indexHtmlPath];
  const seenHtml = new Set();

  while (htmlQueue.length > 0) {
    const currentPath = htmlQueue.shift();
    if (!currentPath || seenHtml.has(currentPath) || !fs.existsSync(currentPath)) continue;
    seenHtml.add(currentPath);

    const currentHtml = fs.readFileSync(currentPath, "utf8");
    const targets = extractLocalTargetsFromHtml(currentHtml);

    for (const target of targets) {
      if (!target.toLowerCase().endsWith(".html")) continue;

      const sourceHtml = path.join(repoRoot, target);
      const destHtml = path.join(distDir, target);
      if (!fs.existsSync(sourceHtml)) continue;

      if (!fs.existsSync(destHtml)) {
        fs.mkdirSync(path.dirname(destHtml), { recursive: true });
        fs.copyFileSync(sourceHtml, destHtml);
      }

      if (!seenHtml.has(destHtml)) {
        htmlQueue.push(destHtml);
      }
    }
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
