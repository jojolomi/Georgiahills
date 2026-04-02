const fs = require("fs");
const path = require("path");

const distDir = path.resolve(process.argv[2] || "astro-site/dist");

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

function fail(msg) {
  process.stderr.write(`✖ ${msg}\n`);
}

function ok(msg) {
  process.stdout.write(`✔ ${msg}\n`);
}

if (!fs.existsSync(distDir)) {
  fail(`dist directory not found: ${distDir}`);
  process.exit(1);
}

// Skip non-SEO utility pages (admin routes, lighthouse reports, tmp files)
const skipRe = /(?:^|\/)(?:admin\.html|admin-v3\/.*\.html|.*\.report\.html|tmp_.*\.html)$/;

let passed = true;
const files = collectHtml(distDir);

for (const file of files) {
  const rel = path.relative(distDir, file).replace(/\\/g, "/");
  if (skipRe.test(rel)) continue;

  const html = fs.readFileSync(file, "utf8");

  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["'][^"']+["']/i);
  if (!canonical) {
    fail(`${rel}: missing canonical`);
    passed = false;
  }

  const hreflangs = [...html.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["']\s+href=["'][^"']+["']/gi)].map(m => m[1].toLowerCase());
  const hasXDefault = hreflangs.includes("x-default");
  const hasEnOrAr = hreflangs.includes("en") || hreflangs.includes("ar");

  if (!hasXDefault || !hasEnOrAr) {
    fail(`${rel}: hreflang set incomplete`);
    passed = false;
  }
}

if (!passed) process.exit(1);
ok(`hreflang validation passed for ${files.length} pages`);
