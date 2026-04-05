import { test, expect } from "@playwright/test";

const email = process.env.ADMIN_V3_E2E_EMAIL || "";
const password = process.env.ADMIN_V3_E2E_PASSWORD || "";

test("admin-v3 auth smoke: owner can sign in and access pages route", async ({ page }) => {
  test.skip(!email || !password, "ADMIN_V3_E2E_EMAIL and ADMIN_V3_E2E_PASSWORD are required");

  await page.goto("http://127.0.0.1:4273/admin-v3/");

  await expect(page.getByText("Owner Login")).toBeVisible();
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Access denied")).toHaveCount(0);
  await expect(page.getByText("Single Owner Mode")).toBeVisible({ timeout: 20000 });

  await page.getByRole("link", { name: "Pages" }).click();
  await expect(page.getByRole("heading", { name: "Page Editor" })).toBeVisible();
});

