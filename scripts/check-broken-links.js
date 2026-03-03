const fs = require("fs");
const path = require("path");

const distDir = path.resolve(process.argv[2] || "apps/web/dist");

function collectHtml(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtml(full, out);
      continue;
    }
    if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function collectFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, out);
      continue;
    }
    out.push(full);
  }
  return out;
}

function shouldCheck(url) {
  if (!url) return false;
  if (/^(https?:)?\/\//i.test(url)) return false;
  if (/^(mailto:|tel:|javascript:|data:|#)/i.test(url)) return false;
  // Skip Next.js bundled assets – they live outside the dist tree
  if (/^\/?_next\//i.test(url)) return false;
  // Known server-rendered routes that are not pre-rendered to HTML
  const dynamicRoutes = ["/privacy", "/terms", "/cancellation", "/insurance", "/licensing"];
  const clean = url.split("#")[0].split("?")[0];
  if (dynamicRoutes.includes(clean)) return false;
  return true;
}

function isOptionalRuntimeAsset(ref) {
  const cleanRaw = ref.split("#")[0].split("?")[0].trim();
  let clean = cleanRaw;
  try {
    clean = decodeURIComponent(cleanRaw);
  } catch {
    clean = cleanRaw;
  }
  const normalized = clean.startsWith("/") ? clean.slice(1) : clean;
  return normalized === "firebase-config.js";
}

function resolveCandidates(ref) {
  const cleanRaw = ref.split("#")[0].split("?")[0].trim();
  let clean = cleanRaw;
  try {
    clean = decodeURIComponent(cleanRaw);
  } catch {
    clean = cleanRaw;
  }
  if (!clean) return [];
  const normalized = clean.startsWith("/") ? clean.slice(1) : clean;
  const candidates = new Set();

  if (normalized === "") {
    candidates.add("index.html");
    return [...candidates];
  }

  candidates.add(normalized);
  if (!normalized.endsWith(".html") && !path.extname(normalized)) {
    candidates.add(`${normalized}.html`);
    candidates.add(path.join(normalized, "index.html").replace(/\\/g, "/"));
  }

  if (normalized.endsWith("/")) {
    candidates.add(`${normalized}index.html`);
    candidates.add(`${normalized.slice(0, -1)}.html`);
  }

  return [...candidates];
}

function stripBasePathCandidate(ref) {
  const cleanRaw = ref.split("#")[0].split("?")[0].trim();
  let clean = cleanRaw;
  try {
    clean = decodeURIComponent(cleanRaw);
  } catch {
    clean = cleanRaw;
  }
  if (!clean || !clean.startsWith("/")) return [];

  const parts = clean.slice(1).split("/");
  if (parts.length < 2) return [];

  const withoutFirstSegment = `/${parts.slice(1).join("/")}`;
  return resolveCandidates(withoutFirstSegment);
}

if (!fs.existsSync(distDir)) {
  process.stderr.write(`✖ dist directory not found: ${distDir}\n`);
  process.exit(1);
}

const existing = new Set(
  collectFiles(distDir).map((f) => path.relative(distDir, f).replace(/\\/g, "/"))
);

let passed = true;
const htmlFiles = collectHtml(distDir);

// Legacy market pages reference old static-site assets – skip them in the link scan
const legacyMarketDirRe = /^(ae|sa|qa|kw|eg)[\/\\]/;

for (const file of htmlFiles) {
  const rel = path.relative(distDir, file).replace(/\\/g, "/");
  if (rel === "404.html" || rel === "500.html") continue;
  if (legacyMarketDirRe.test(rel)) continue;
  const html = fs.readFileSync(file, "utf8");

  const refs = [
    ...[...html.matchAll(/<a[^>]*\shref=["']([^"']+)["']/gi)].map((m) => m[1]),
    ...[...html.matchAll(/<link[^>]*\shref=["']([^"']+)["']/gi)].map((m) => m[1]),
    ...[...html.matchAll(/<script[^>]*\ssrc=["']([^"']+)["']/gi)].map((m) => m[1])
  ];

  for (const ref of refs) {
    if (!shouldCheck(ref)) continue;
    if (isOptionalRuntimeAsset(ref)) continue;
    const candidates = resolveCandidates(ref);
    if (!candidates.length) continue;
    const fallbackCandidates = stripBasePathCandidate(ref);
    const found = [...candidates, ...fallbackCandidates].some((c) => existing.has(c));
    if (!found) {
      process.stderr.write(`✖ ${rel}: broken internal reference ${ref}\n`);
      passed = false;
    }
  }
}

if (!passed) process.exit(1);
process.stdout.write(`✔ broken-link scan passed for ${htmlFiles.length} pages\n`);
