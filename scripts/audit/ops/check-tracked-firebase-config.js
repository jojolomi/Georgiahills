#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const filePath = path.resolve(process.cwd(), "firebase-config.js");

function fail(message) {
  process.stderr.write(`✖ ${message}\n`);
  process.exitCode = 1;
}

function ok(message) {
  process.stdout.write(`✔ ${message}\n`);
}

if (!fs.existsSync(filePath)) {
  ok("firebase-config.js is not present in repository root");
  process.exit(0);
}

const content = fs.readFileSync(filePath, "utf8");

const suspiciousPatterns = [
  /AIza[0-9A-Za-z_-]{30,}/,
  /https:\/\/europe-west1-(?!YOUR_PROJECT_ID)[^\s"']+\.cloudfunctions\.net\/(?:createBookingLead|adminApi)/,
  /projectId\s*:\s*["'](?!YOUR_PROJECT_ID)[^"']+["']/
];

const hasSuspiciousValue = suspiciousPatterns.some((pattern) => pattern.test(content));

if (hasSuspiciousValue) {
  fail("firebase-config.js contains live project credentials/endpoints. Keep this file untracked or placeholder-only.");
} else {
  ok("firebase-config.js does not contain live project credentials");
}

if (process.exitCode) {
  process.exit(process.exitCode);
}
