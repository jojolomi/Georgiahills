import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const pageTargets = [
  { name: "home-en", next: "/en", legacy: "/" },
  { name: "home-ar", next: "/ar", legacy: "/arabic.html" },
  { name: "booking", next: "/booking", legacy: "/booking.html" },
  { name: "destination", next: "/en/destinations/tbilisi", legacy: "/tbilisi.html" },
  { name: "blog-article", next: "/en/blog/is-georgia-safe", legacy: "/blog/en/is-georgia-safe-for-families-2026.html" },
  { name: "privacy-en", next: "/en/privacy", legacy: "/privacy.html" },
  { name: "privacy-ar", next: "/ar/privacy", legacy: "/privacy-ar.html" }
];

async function gotoWithFallback(page: Page, primary: string, fallback: string) {
  try {
    const response = await page.goto(primary);
    if (response && response.status() < 400) {
      return { response, resolvedPath: primary };
    }
  } catch {
    // Fall back to legacy/static mapping below.
  }

  const fallbackResponse = await page.goto(fallback);
  return { response: fallbackResponse, resolvedPath: fallback };
}

test.describe("critical accessibility scan", () => {
  for (const target of pageTargets) {
    test(`has no critical axe violations on ${target.name}`, async ({ page }) => {
      const { response, resolvedPath } = await gotoWithFallback(page, target.next, target.legacy);
      expect(response?.status(), `Expected a successful response for ${target.name} at ${resolvedPath}`).toBeLessThan(400);
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page }).analyze();
      const criticalViolations = results.violations.filter((violation) => violation.impact === "critical");

      expect(
        criticalViolations,
        criticalViolations
          .map((violation) => `${violation.id}: ${violation.help} (${violation.nodes.length} node(s))`)
          .join("\n")
      ).toEqual([]);
    });
  }
});
