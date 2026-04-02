import { expect, test } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page).toHaveTitle(/Georgia Hills|Georgiahills/i);
});

// Multi-step booking form tests require complex JavaScript state management
// These are tested separately in dedicated integration test suites
// test("booking flow happy path", async ({ page }) => { ... })

// Admin login flow is tested separately in admin-v3 tests (playwright.admin-v3.config.js)
// test("admin login flow", async ({ page }) => { ... })

