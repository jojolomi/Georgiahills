import { expect, test } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page).toHaveTitle(/Georgia Hills|Georgiahills/i);
});

test("booking flow happy path", async ({ page }) => {
  await page.route("**/api/bookings", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ booking: { id: "e2e-booking-123" } })
    });
  });

  await page.goto("/booking");
  await expect(page.getByRole("heading", { name: "Traveler Details" })).toBeVisible();

  await page.getByLabel("Full name").fill("Playwright Traveler");
  await page.getByLabel("Email").fill("traveler@example.com");
  await page.getByLabel("Phone (optional)").fill("+97150000000");
  await page.getByRole("button", { name: "Next" }).click();

  const successMessage = page.getByText(/Booking created:/i);
  try {
    await expect(successMessage).toBeVisible({ timeout: 30000 });
    return;
  } catch {
    // Continue through the multi-step flow when immediate submit does not occur.
  }

  await expect(page.getByRole("heading", { name: "Trip Details" })).toBeVisible();

  await page.getByLabel("Destination").fill("tbilisi");
  await page.getByLabel("Travel date").fill("2026-06-15");
  await page.$eval("#travelDate", (element) => {
    const input = element as HTMLInputElement;
    input.value = "2026-06-15";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  const guests = page.getByLabel("Number of guests");
  await guests.click();
  await guests.fill("3");
  await page.getByRole("button", { name: "Next" }).click();

  const submitButton = page.getByRole("button", { name: "Submit Booking" });
  const submitVisible = await submitButton.isVisible().catch(() => false);
  if (submitVisible) {
    await submitButton.click();
  }

  await expect(successMessage).toBeVisible({ timeout: 20000 });
});

// Admin login flow is tested separately in admin-v3 tests (playwright.admin-v3.config.js)
// test("admin login flow", async ({ page }) => { ... })

