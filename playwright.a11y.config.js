import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "a11y.spec.ts",
  timeout: 60000,
  expect: { timeout: 10000 },
  retries: 0,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "retain-on-failure"
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "cd apps/web && npm run build && npx next start -H 127.0.0.1 -p 4174",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: true,
    timeout: 240000
  }
});
