const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const canonicalDir = path.join(rootDir, "apps", "web", "public");

const assets = [
  "shared-navbar.js",
  "shared-footer.js",
  "style.css",
  "script.js",
  "destination-script.js"
];

function copyAsset(fileName) {
  const sourcePath = path.join(canonicalDir, fileName);
  const destinationPath = path.join(rootDir, fileName);

  if (!fs.existsSync(sourcePath)) {
    process.stderr.write(`FAIL ${fileName}: canonical source missing at apps/web/public/${fileName}\n`);
    return false;
  }

  fs.copyFileSync(sourcePath, destinationPath);
  process.stdout.write(`SYNC ${fileName}: apps/web/public/${fileName} -> ${fileName}\n`);
  return true;
}

let passed = true;

for (const asset of assets) {
  passed = copyAsset(asset) && passed;
}

if (!passed) {
  process.exit(1);
}