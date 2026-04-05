import { test, expect } from "@playwright/test";

const pages = [
  "/en.html",
  "/ar.html",
  "/booking.html"
];

for (const page of pages) {
  test(`smoke: ${page}`, async ({ page: browserPage }) => {
    await browserPage.goto(`http://127.0.0.1:4173${page}`);
    await expect(browserPage.locator("main")).toBeVisible();
    await expect(browserPage).toHaveTitle(/Georgia Hills|Georgiahills|جورجيا|Driver|سائق/i);
  });
}
