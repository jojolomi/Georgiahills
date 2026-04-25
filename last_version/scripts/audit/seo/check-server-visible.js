const fs = require('fs');
const path = require('path');

const distDir = process.argv[2] || path.join('apps', 'web', 'dist');

const checks = [
  { file: 'index.html', expect: ['<h1', 'TravelAgency'] },
  { file: 'arabic.html', expect: ['<h1', 'lang="ar"', 'dir="rtl"'] },
  { file: 'services.html', expect: ['<h1', 'Service'] },
  { file: 'services-ar.html', expect: ['<h1', 'lang="ar"'] },
  { file: 'tbilisi.html', expect: ['<h1', 'TouristAttraction'] },
  { file: 'tbilisi-ar.html', expect: ['<h1', 'lang="ar"'] }
];

function fail(message) {
  console.error(`✖ ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`✔ ${message}`);
}

if (!fs.existsSync(distDir)) {
  fail(`dist directory not found: ${distDir}`);
  process.exit(1);
}

for (const check of checks) {
  const filePath = path.join(distDir, check.file);
  if (!fs.existsSync(filePath)) {
    fail(`missing file: ${check.file}`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  if (!html || html.trim().length < 400) {
    fail(`${check.file} appears too small or empty`);
    continue;
  }

  let ok = true;
  for (const token of check.expect) {
    if (!html.includes(token)) {
      fail(`${check.file} missing expected token: ${token}`);
      ok = false;
    }
  }

  if (ok) {
    pass(`${check.file} includes server-visible content markers`);
  }
}

if (process.exitCode) {
  console.error('\nServer-visible HTML audit failed. Ensure prerendered/static HTML ships in apps/web/dist.');
  process.exit(process.exitCode);
}

console.log('\nServer-visible HTML audit passed for key pages.');
