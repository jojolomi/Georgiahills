const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const distDir = path.join(rootDir, "admin-v3", "dist");
const publishDir = path.join(rootDir, "admin-v3");
const distIndex = path.join(distDir, "index.html");
const prodIndex = path.join(publishDir, "index.prod.html");

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
  const targetPath = path.join(publishDir, entry);
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
  copyRecursive(sourcePath, targetPath);
}

fs.copyFileSync(distIndex, prodIndex);
console.log("Prepared admin-v3 hosting artifacts:", {
  index: "admin-v3/index.prod.html",
  assetsFrom: "admin-v3/dist",
  assetsTo: "admin-v3/"
});
