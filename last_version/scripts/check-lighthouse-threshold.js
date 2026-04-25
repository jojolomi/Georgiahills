const fs = require("fs");
const path = require("path");

const reportPath = path.resolve(process.argv[2] || "./lighthouse.json");

if (!fs.existsSync(reportPath)) {
  process.stderr.write(`✖ Lighthouse report not found: ${reportPath}\n`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

const perf = report?.categories?.performance?.score;
const a11y = report?.categories?.accessibility?.score;

const minPerf = 0.85;
const minA11y = 0.9;

let passed = true;

if (typeof perf !== "number" || perf < minPerf) {
  process.stderr.write(`✖ Performance score ${(perf ?? "n/a")} is below ${minPerf}\n`);
  passed = false;
}

if (typeof a11y !== "number" || a11y < minA11y) {
  process.stderr.write(`✖ Accessibility score ${(a11y ?? "n/a")} is below ${minA11y}\n`);
  passed = false;
}

if (!passed) {
  process.exit(1);
}

process.stdout.write("✔ Lighthouse thresholds passed (Performance >= 85, Accessibility >= 90)\n");
