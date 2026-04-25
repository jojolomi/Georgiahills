import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "core-flows.spec.ts",
  timeout: 45000,
  expect: { timeout: 7000 },
  retries: 0,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry"
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "cd apps/web && npx next dev -H 127.0.0.1 -p 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 120000
  }
});
