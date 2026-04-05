const fs = require("fs");
const path = require("path");

const distDir = path.resolve(process.argv[2] || "apps/web/dist");
const maxTitleLength = 60;
const maxDescriptionLength = 155;

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

function getPathFromCanonical(href) {
  try {
    const url = new URL(href);
    return `${url.pathname.replace(/\/$/, "") || "/"}`;
  } catch {
    return href.replace(/\/$/, "") || "/";
  }
}

function expectedPath(rel) {
  const clean = rel.replace(/\\/g, "/");
  if (clean === "index.html") return "/";
  if (clean.endsWith("/index.html")) {
    return `/${clean.replace(/\/index\.html$/, "")}`;
  }
  return `/${clean.replace(/\.html$/, "")}`;
}

function extractSingle(pattern, html) {
  const match = html.match(pattern);
  return match ? match[1].trim() : "";
}

function stripHtml(input) {
  return String(input || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

if (!fs.existsSync(distDir)) {
  process.stderr.write(`✖ dist directory not found: ${distDir}\n`);
  process.exit(1);
}

const files = collectHtml(distDir);
let passed = true;

for (const file of files) {
  const rel = path.relative(distDir, file).replace(/\\/g, "/");
  const isLocalizedTemplate =
    rel === "en.html" ||
    rel === "ar.html" ||
    rel.startsWith("en/") ||
    rel.startsWith("ar/");

  if (!isLocalizedTemplate) {
    continue;
  }

  const html = fs.readFileSync(file, "utf8");

  const title = extractSingle(/<title>([\s\S]*?)<\/title>/i, html);
  if (!title || title.length > maxTitleLength) {
    process.stderr.write(`✖ ${rel}: title is missing or exceeds ${maxTitleLength} chars\n`);
    passed = false;
  }

  const description = extractSingle(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i, html);
  if (!description || description.length > maxDescriptionLength) {
    process.stderr.write(`✖ ${rel}: meta description is missing or exceeds ${maxDescriptionLength} chars\n`);
    passed = false;
  }

  const h1Matches = html.match(/<h1\b[^>]*>/gi) || [];
  if (h1Matches.length !== 1) {
    process.stderr.write(`✖ ${rel}: expected exactly 1 H1, found ${h1Matches.length}\n`);
    passed = false;
  }

  const h1Text = stripHtml(extractSingle(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i, html));
  if (rel === "ar.html" || rel.startsWith("ar/")) {
    if (!/[\u0600-\u06FF]/.test(h1Text)) {
      process.stderr.write(`✖ ${rel}: Arabic pages must have an Arabic H1\n`);
      passed = false;
    }
  }

  const htmlTag = html.match(/<html\b([^>]*)>/i);
  const htmlAttrs = htmlTag ? htmlTag[1] : "";
  const langMatch = htmlAttrs.match(/\blang=["']([^"']+)["']/i);
  const dirMatch = htmlAttrs.match(/\bdir=["']([^"']+)["']/i);

  const lang = (langMatch?.[1] || "").toLowerCase();
  if (!["en", "ar"].includes(lang)) {
    process.stderr.write(`✖ ${rel}: html lang must be en or ar\n`);
    passed = false;
  }

  const expectedDir = lang === "ar" ? "rtl" : "ltr";
  if ((dirMatch?.[1] || "").toLowerCase() !== expectedDir) {
    process.stderr.write(`✖ ${rel}: html dir must be ${expectedDir} for lang=${lang || "unknown"}\n`);
    passed = false;
  }

  const canonicalHref = extractSingle(/<link[^>]*rel=["']canonical["'][^>]*href=["']([\s\S]*?)["'][^>]*>/i, html);
  if (!canonicalHref) {
    process.stderr.write(`✖ ${rel}: missing canonical link\n`);
    passed = false;
  } else {
    const canonicalPath = getPathFromCanonical(canonicalHref);
    const currentPath = expectedPath(rel);
    if (canonicalPath !== currentPath) {
      process.stderr.write(`✖ ${rel}: canonical must point to self (${currentPath}), found ${canonicalPath}\n`);
      passed = false;
    }
  }

  const schemaScripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (schemaScripts.length > 1) {
    process.stderr.write(`✖ ${rel}: JSON-LD must be emitted once per page (found ${schemaScripts.length})\n`);
    passed = false;
  }

  if (schemaScripts.length === 1) {
    try {
      const payload = JSON.parse((schemaScripts[0][1] || "").trim());
      const graph = Array.isArray(payload?.["@graph"]) ? payload["@graph"] : [payload];
      for (const node of graph) {
        if (!node || typeof node !== "object") continue;
        const type = String(node["@type"] || "");
        if (["BlogPosting", "FAQPage", "Product", "TouristTrip", "TouristAttraction", "Review", "Event"].includes(type)) {
          if (!node.inLanguage) {
            process.stderr.write(`✖ ${rel}: ${type} node missing inLanguage\n`);
            passed = false;
          }
        }

        if (type === "Product") {
          const offer = node.offers;
          if (offer && typeof offer === "object") {
            const priceCurrency = String(offer.priceCurrency || "");
            const price = offer.price;
            if (priceCurrency && priceCurrency !== "GEL") {
              process.stderr.write(`✖ ${rel}: Product Offer priceCurrency should be GEL\n`);
              passed = false;
            }
            if (typeof price === "undefined" || price === null || String(price).trim() === "") {
              process.stderr.write(`✖ ${rel}: Product Offer missing price\n`);
              passed = false;
            }
          }
        }
      }
    } catch (error) {
      process.stderr.write(`✖ ${rel}: invalid JSON-LD (${error.message})\n`);
      passed = false;
    }
  }
}

if (!passed) process.exit(1);
process.stdout.write(`✔ on-page SEO validation passed for ${files.length} pages\n`);
