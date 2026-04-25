#!/usr/bin/env node

const { spawn } = require("node:child_process");
const path = require("node:path");
const { setTimeout: delay } = require("timers/promises");

const mode = (process.argv[2] || "strict").toLowerCase();
const port = Number(process.env.CUTOVER_LOCAL_PORT || "4173");
const host = process.env.CUTOVER_LOCAL_HOST || "127.0.0.1";
const baseUrl = `http://${host}:${port}`;

function spawnCommand(command, args, options = {}) {
  return spawn(command, args, {
    stdio: "inherit",
    cwd: process.cwd(),
    shell: process.platform === "win32",
    ...options
  });
}

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  let lastError;

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET", redirect: "follow" });
      if (response.ok || response.status === 404) {
        return;
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await delay(500);
  }

  throw new Error(`Local server did not become ready at ${url}: ${lastError?.message || "timeout"}`);
}

async function run() {
  const server = spawnCommand("npx", ["http-server", ".", "-p", String(port), "-a", host, "-c-1"]);

  try {
    await waitForServer(`${baseUrl}/`, 25000);

    const smokeScript = path.join("scripts", "audit", "ops", "check-cutover-smoke.js");
    const smoke = spawnCommand("node", [smokeScript, baseUrl, mode], {
      env: { ...process.env, CUTOVER_BASE_URL: baseUrl }
    });

    const exitCode = await new Promise((resolve) => {
      smoke.on("exit", (code) => resolve(code ?? 1));
    });

    if (exitCode !== 0) {
      process.exitCode = exitCode;
    }
  } finally {
    server.kill();
  }
}

run().catch((error) => {
  console.error(`Cutover local smoke runner failed: ${error.message}`);
  process.exitCode = 1;
});
