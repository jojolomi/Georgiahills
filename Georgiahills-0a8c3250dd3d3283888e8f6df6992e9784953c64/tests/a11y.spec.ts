import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pagePaths = ["/en", "/booking", "/blog", "/contact"];

test.describe("critical accessibility scan", () => {
  for (const path of pagePaths) {
    test(`has no critical axe violations on ${path}`, async ({ page }) => {
      await page.goto(path);
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
