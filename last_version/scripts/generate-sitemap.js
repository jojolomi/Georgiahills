#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content');
const OUTPUT_DIR = path.join(ROOT, 'public');
const BASE_URL = process.env.SITE_URL || 'https://www.georgiahills.com';
const TODAY = new Date().toISOString().split('T')[0];

function safeReadDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true });
}

function collectBlogUrls(locale) {
  const blogDir = path.join(CONTENT_DIR, locale, 'blog');
  const entries = safeReadDir(blogDir)
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => {
      const slug = entry.name.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
      return {
        loc: `${BASE_URL}/${locale}/blog/${slug}`,
        lastmod: TODAY,
        locale,
      };
    });

  return entries;
}

function staticUrls(locale) {
  return [
    { loc: `${BASE_URL}/${locale}`, lastmod: TODAY, locale },
    { loc: `${BASE_URL}/${locale}/blog`, lastmod: TODAY, locale },
    { loc: `${BASE_URL}/${locale}/services`, lastmod: TODAY, locale },
    { loc: `${BASE_URL}/${locale}/contact`, lastmod: TODAY, locale },
  ];
}

function xmlEscape(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toMapBySuffix(urls) {
  const map = new Map();
  urls.forEach((item) => {
    const suffix = item.loc.replace(`${BASE_URL}/`, '');
    const parts = suffix.split('/');
    const locale = parts.shift();
    const withoutLocale = parts.join('/');
    map.set(`${locale}:${withoutLocale}`, item.loc);
  });
  return map;
}

function buildUrlset(enUrls, arUrls) {
  const byKey = new Map();
  const enMap = toMapBySuffix(enUrls);
  const arMap = toMapBySuffix(arUrls);

  const keys = new Set();
  [...enMap.keys(), ...arMap.keys()].forEach((k) => {
    keys.add(k.split(':').slice(1).join(':'));
  });

  keys.forEach((pathKey) => {
    const en = enMap.get(`en:${pathKey}`);
    const ar = arMap.get(`ar:${pathKey}`);

    if (en) {
      byKey.set(en, {
        loc: en,
        en,
        ar,
      });
    }

    if (ar) {
      byKey.set(ar, {
        loc: ar,
        en,
        ar,
      });
    }
  });

  const rows = [];
  for (const item of byKey.values()) {
    const alternates = [];
    if (item.en) {
      alternates.push(`<xhtml:link rel=\"alternate\" hreflang=\"en\" href=\"${xmlEscape(item.en)}\" />`);
    }
    if (item.ar) {
      alternates.push(`<xhtml:link rel=\"alternate\" hreflang=\"ar\" href=\"${xmlEscape(item.ar)}\" />`);
    }
    alternates.push(`<xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"${xmlEscape(item.en || item.ar)}\" />`);

    rows.push(`  <url>\n    <loc>${xmlEscape(item.loc)}</loc>\n    <lastmod>${TODAY}</lastmod>\n    ${alternates.join('\n    ')}\n  </url>`);
  }

  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n${rows.join('\n')}\n</urlset>\n`;
}

function buildSimpleUrlset(urls) {
  const rows = urls.map((item) => `  <url>\n    <loc>${xmlEscape(item.loc)}</loc>\n    <lastmod>${item.lastmod}</lastmod>\n  </url>`);
  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n${rows.join('\n')}\n</urlset>\n`;
}

function write(fileName, content) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, fileName), content, 'utf8');
}

function main() {
  const enUrls = [...staticUrls('en'), ...collectBlogUrls('en')];
  const arUrls = [...staticUrls('ar'), ...collectBlogUrls('ar')];

  write('sitemap-en.xml', buildSimpleUrlset(enUrls));
  write('sitemap-ar.xml', buildSimpleUrlset(arUrls));
  write('sitemap.xml', buildUrlset(enUrls, arUrls));

  process.stdout.write('Generated sitemap.xml, sitemap-en.xml, sitemap-ar.xml\n');
}

main();
