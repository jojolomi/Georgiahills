const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const contentDir = path.resolve(process.argv[2] || "apps/web/content/blog/ar");

function collectMdx(dir, out = []) {
  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectMdx(full, out);
      continue;
    }
    if (entry.name.endsWith(".mdx")) out.push(full);
  }

  return out;
}

function hasArabic(value) {
  return /[\u0600-\u06FF]/.test(String(value || ""));
}

const files = collectMdx(contentDir);

if (!files.length) {
  process.stderr.write(`✖ no Arabic MDX files found in ${contentDir}\n`);
  process.exit(1);
}

let passed = true;

for (const file of files) {
  const rel = path.relative(process.cwd(), file).replace(/\\/g, "/");
  const raw = fs.readFileSync(file, "utf8");
  const parsed = matter(raw);
  const fm = parsed.data || {};

  const lang = String(fm.lang || fm.locale || "").toLowerCase();
  if (lang !== "ar") {
    process.stderr.write(`✖ ${rel}: frontmatter must include lang/locale as ar\n`);
    passed = false;
  }

  const reviewerName = fm.reviewer_name || fm.reviewerName || fm.author;
  if (!reviewerName || !String(reviewerName).trim()) {
    process.stderr.write(`✖ ${rel}: missing reviewer name (reviewer_name or author)\n`);
    passed = false;
  }

  const reviewedDate = fm.reviewed_date || fm.reviewedDate;
  if (!reviewedDate || !/^\d{4}-\d{2}-\d{2}$/.test(String(reviewedDate))) {
    process.stderr.write(`✖ ${rel}: missing reviewed_date in YYYY-MM-DD\n`);
    passed = false;
  }

  const metaTitle = fm.meta_title || fm.metaTitle;
  const metaDescription = fm.meta_description || fm.metaDescription;
  const publishDate = fm.publish_date || fm.date;

  if (!metaTitle || !String(metaTitle).trim()) {
    process.stderr.write(`✖ ${rel}: missing meta_title/metaTitle\n`);
    passed = false;
  }

  if (!metaDescription || !String(metaDescription).trim()) {
    process.stderr.write(`✖ ${rel}: missing meta_description/metaDescription\n`);
    passed = false;
  }

  if (!publishDate || !/^\d{4}-\d{2}-\d{2}$/.test(String(publishDate))) {
    process.stderr.write(`✖ ${rel}: missing publish_date/date in YYYY-MM-DD\n`);
    passed = false;
  }

  if (!hasArabic(fm.title)) {
    process.stderr.write(`✖ ${rel}: title should be in Arabic (MSA)\n`);
    passed = false;
  }

  const h1Match = parsed.content.match(/\n#\s+(.+)/);
  const h1 = h1Match ? h1Match[1].trim() : "";
  if (!h1 || !hasArabic(h1)) {
    process.stderr.write(`✖ ${rel}: missing Arabic H1 in content\n`);
    passed = false;
  }
}

if (!passed) process.exit(1);
process.stdout.write(`✔ Arabic frontmatter QA passed for ${files.length} file(s)\n`);
