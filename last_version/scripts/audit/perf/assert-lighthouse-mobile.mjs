import fs from "node:fs";
import path from "node:path";

const reportDir = process.argv[2] || "artifacts/lighthouse";
const requiredScores = {
  performance: 0.85,
  accessibility: 0.9,
  "best-practices": 0.9
};

const cwvThresholds = {
  "largest-contentful-paint": 2500,
  "cumulative-layout-shift": 0.1,
  "interaction-to-next-paint": 200
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function toScore(audit, categoryKey) {
  const value = audit?.categories?.[categoryKey]?.score;
  if (typeof value !== "number") return null;
  return value;
}

function toNumericAudit(audit, key) {
  const value = audit?.audits?.[key]?.numericValue;
  if (typeof value !== "number") return null;
  return value;
}

function listReports(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f));
}

const reports = listReports(reportDir);
if (!reports.length) {
  console.error(`✖ No Lighthouse JSON reports found in ${reportDir}`);
  process.exit(1);
}

let passed = true;

for (const reportPath of reports) {
  const report = readJson(reportPath);
  const reportName = path.basename(reportPath);

  for (const [category, minScore] of Object.entries(requiredScores)) {
    const score = toScore(report, category);
    if (score === null) {
      console.error(`✖ ${reportName}: missing category score ${category}`);
      passed = false;
      continue;
    }

    if (score < minScore) {
      console.error(`✖ ${reportName}: ${category} score ${score.toFixed(2)} < ${minScore.toFixed(2)}`);
      passed = false;
    }
  }

  for (const [metric, maxValue] of Object.entries(cwvThresholds)) {
    const numericValue = toNumericAudit(report, metric);
    if (numericValue === null) {
      console.error(`✖ ${reportName}: missing audit ${metric}`);
      passed = false;
      continue;
    }

    if (numericValue > maxValue) {
      console.error(`✖ ${reportName}: ${metric} ${numericValue.toFixed(0)} > ${maxValue}`);
      passed = false;
    }
  }
}

if (!passed) {
  process.exit(1);
}

console.log(`✔ Lighthouse mobile assertions passed for ${reports.length} report(s)`);
