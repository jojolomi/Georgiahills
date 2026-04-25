import { test, expect } from "@playwright/test";

test("admin-v3 smoke: login screen renders", async ({ page }) => {
  const response = await page.goto("http://127.0.0.1:4273/admin-v3/");
  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveTitle(/Georgia Hills Admin v3/i);
  const html = await page.content();
  expect(html).toContain('id="root"');
  expect(html).toMatch(/(\/src\/main\.jsx|\/admin-v3\/assets\/.+\.(js|css))/i);
});
