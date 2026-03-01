const fs = require("fs");
const path = require("path");

const distDir = path.resolve(process.argv[2] || "apps/web/dist");

if (!fs.existsSync(distDir)) {
  process.stderr.write(`✖ dist directory not found: ${distDir}\n`);
  process.exit(1);
}

// Next.js App Router pages – locale in the path, not the filename
const targetPages = [
  "en.html",
  "ar.html",
  "booking.html"
];
const requiredLinks = [
  "/privacy",
  "/terms",
  "/cancellation",
  "/insurance",
  "/licensing"
];

let passed = true;

for (const file of targetPages) {
  const full = path.join(distDir, file);
  if (!fs.existsSync(full)) {
    process.stderr.write(`✖ missing page: ${file}\n`);
    passed = false;
    continue;
  }

  const html = fs.readFileSync(full, "utf8");
  for (const token of requiredLinks) {
    if (!html.includes(token)) {
      process.stderr.write(`✖ ${file}: missing legal link token "${token}"\n`);
      passed = false;
    }
  }
}

if (!passed) process.exit(1);
process.stdout.write("✔ legal link presence check passed\n");
