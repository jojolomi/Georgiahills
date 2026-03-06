const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const rootDir = process.cwd();
const canonicalDir = path.join(rootDir, "apps", "web", "public");

const assets = [
  {
    name: "shared-navbar.js",
    mode: "required"
  },
  {
    name: "shared-footer.js",
    mode: "required"
  },
  {
    name: "style.css",
    mode: "required"
  },
  {
    name: "script.js",
    mode: "required"
  },
  {
    name: "destination-script.js",
    mode: "required"
  }
];

function readHash(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function relative(filePath) {
  return path.relative(rootDir, filePath).replace(/\\/g, "/");
}

let failed = false;

for (const asset of assets) {
  const rootPath = path.join(rootDir, asset.name);
  const canonicalPath = path.join(canonicalDir, asset.name);
  const rootExists = fs.existsSync(rootPath);
  const canonicalExists = fs.existsSync(canonicalPath);

  if (asset.mode === "required") {
    if (!rootExists || !canonicalExists) {
      failed = true;
      const missing = [
        !rootExists ? relative(rootPath) : null,
        !canonicalExists ? relative(canonicalPath) : null
      ].filter(Boolean);
      process.stderr.write(`FAIL ${asset.name}: missing required copy at ${missing.join(", ")}\n`);
      continue;
    }

    if (readHash(rootPath) !== readHash(canonicalPath)) {
      failed = true;
      process.stderr.write(
        `FAIL ${asset.name}: ${relative(rootPath)} differs from canonical ${relative(canonicalPath)}\n`
      );
      continue;
    }

    process.stdout.write(`OK   ${asset.name}: root matches canonical public copy\n`);
    continue;
  }

  if (!rootExists || !canonicalExists) {
    process.stdout.write(
      `WARN ${asset.name}: parity review needed because one copy is missing (${rootExists ? "root present" : "root missing"}, ${canonicalExists ? "canonical present" : "canonical missing"})\n`
    );
    continue;
  }

  if (readHash(rootPath) !== readHash(canonicalPath)) {
    process.stdout.write(
      `WARN ${asset.name}: differs between ${relative(rootPath)} and ${relative(canonicalPath)}; keep under migration review\n`
    );
    continue;
  }

  process.stdout.write(`OK   ${asset.name}: currently aligned\n`);
}

if (failed) {
  process.exit(1);
}