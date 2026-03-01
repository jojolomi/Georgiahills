const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const distDir = path.join(rootDir, "apps", "admin", "dist");
const legacyPublishDir = path.join(rootDir, "apps", "admin");
const astroDistDir = path.join(rootDir, "apps", "web", "dist");
const astroPublishDir = path.join(astroDistDir, "admin-v3");
const distIndex = path.join(distDir, "index.html");
const legacyProdIndex = path.join(legacyPublishDir, "index.prod.html");

function copyRecursive(source, destination) {
  fs.cpSync(source, destination, { recursive: true, force: true });
}

if (!fs.existsSync(distDir) || !fs.existsSync(distIndex)) {
  throw new Error("admin-v3 build output missing. Run `npm run build:admin-v3` first.");
}

const distEntries = fs.readdirSync(distDir);
for (const entry of distEntries) {
  if (entry === "index.html") {
    continue;
  }
  const sourcePath = path.join(distDir, entry);
  const legacyTargetPath = path.join(legacyPublishDir, entry);
  if (fs.existsSync(legacyTargetPath)) {
    fs.rmSync(legacyTargetPath, { recursive: true, force: true });
  }
  copyRecursive(sourcePath, legacyTargetPath);
}

fs.copyFileSync(distIndex, legacyProdIndex);

if (fs.existsSync(astroDistDir)) {
  fs.mkdirSync(astroPublishDir, { recursive: true });
  for (const entry of distEntries) {
    const sourcePath = path.join(distDir, entry);
    const astroTargetPath = path.join(astroPublishDir, entry);
    if (fs.existsSync(astroTargetPath)) {
      fs.rmSync(astroTargetPath, { recursive: true, force: true });
    }
    copyRecursive(sourcePath, astroTargetPath);
  }
}

console.log("Prepared admin-v3 hosting artifacts:", {
  legacyIndex: "apps/admin/index.prod.html",
  astroIndex: fs.existsSync(astroDistDir) ? "apps/web/dist/admin-v3/index.html" : "skipped (apps/web/dist not found)",
  assetsFrom: "apps/admin/dist",
  assetsToLegacy: "apps/admin/",
  assetsToAstro: fs.existsSync(astroDistDir) ? "apps/web/dist/admin-v3/" : "skipped"
});
