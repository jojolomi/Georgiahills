const expectedNodeMajor = Number(process.env.EXPECTED_NODE_MAJOR || "20");
const required = String(process.env.REQUIRED_ENV_KEYS || "")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);
const environment = process.env.GH_ENVIRONMENT || "unknown";

let passed = true;
const nodeMajor = Number(process.versions.node.split(".")[0]);

if (nodeMajor !== expectedNodeMajor) {
  console.error(`✖ Node major mismatch for ${environment}: expected ${expectedNodeMajor}, got ${nodeMajor}`);
  passed = false;
}

for (const key of required) {
  if (!process.env[key]) {
    console.error(`✖ Missing required environment variable: ${key}`);
    passed = false;
  }
}

if (environment === "production" && process.env.FIREBASE_PROJECT_ID === process.env.FIREBASE_PROJECT_ID_STAGING_FALLBACK) {
  console.error("✖ Production project ID must not match staging project ID fallback.");
  passed = false;
}

if (!passed) process.exit(1);
console.log(`✔ runtime parity checks passed for ${environment}`);
