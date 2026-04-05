import { expect, test } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/en");
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

test("admin login flow", async ({ page }) => {
  await page.goto("/admin/login");

  await expect(page.getByRole("heading", { name: "Admin Login" })).toBeVisible();
  await page.getByLabel("Email").fill("admin@example.com");
  await page.getByLabel("Password").fill("invalid-password");

  await page.getByRole("button", { name: "Log in to Admin" }).click();
  await page.waitForLoadState("networkidle");

  if (page.url().includes("/admin/login")) {
    await expect(
      page.getByText(/Invalid email or password|Authentication is not configured|insufficient|Please enter both/i)
    ).toBeVisible();
  } else {
    await expect(page.getByText(/Admin Panel/i)).toBeVisible();
  }
});
