import { test } from "node:test";
import assert from "node:assert";
import { buildLocaleAlternates, isSupportedLocale, normalizeLocale } from "./routing.js";

test("routing contract", async (t) => {
  await t.test("normalizes supported locale values", () => {
    assert.strictEqual(normalizeLocale("ar"), "ar");
    assert.strictEqual(normalizeLocale("ar-SA"), "ar");
    assert.strictEqual(normalizeLocale("en"), "en");
    assert.strictEqual(normalizeLocale("fr"), "en");
  });

  await t.test("detects supported locale values", () => {
    assert.strictEqual(isSupportedLocale("ar"), true);
    assert.strictEqual(isSupportedLocale("en"), true);
    assert.strictEqual(isSupportedLocale("fr"), false);
  });

  await t.test("builds locale alternates", () => {
    const alternates = buildLocaleAlternates({ siteUrl: "https://georgiahills.com", pathname: "/booking.html" });
    assert.strictEqual(alternates.en, "https://georgiahills.com/en/booking.html");
    assert.strictEqual(alternates.ar, "https://georgiahills.com/ar/booking.html");
    assert.strictEqual(alternates["x-default"], "https://georgiahills.com/en/booking.html");
  });
});
