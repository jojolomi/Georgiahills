import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  buildHreflangAlternates,
  defaultLocale,
  detectLocale,
  getDirection,
  isSupportedLocale,
  resolveLocale
} from "./i18n.ts";

describe("isSupportedLocale", () => {
  test("returns true for supported locales", () => {
    assert.strictEqual(isSupportedLocale("en"), true);
    assert.strictEqual(isSupportedLocale("ar"), true);
  });

  test("returns false for unsupported locales", () => {
    assert.strictEqual(isSupportedLocale("fr"), false);
    assert.strictEqual(isSupportedLocale("en-US"), false);
  });
});

describe("detectLocale", () => {
  test("detects exact supported locales", () => {
    assert.strictEqual(detectLocale("en"), "en");
    assert.strictEqual(detectLocale("ar"), "ar");
  });

  test("normalizes locale variants", () => {
    assert.strictEqual(detectLocale("en-US"), "en");
    assert.strictEqual(detectLocale("ar-AE"), "ar");
  });

  test("falls back to default locale", () => {
    assert.strictEqual(detectLocale("fr-FR"), defaultLocale);
    assert.strictEqual(detectLocale(undefined), defaultLocale);
    assert.strictEqual(detectLocale(null), defaultLocale);
  });
});

describe("resolveLocale", () => {
  test("prefers a supported route locale", () => {
    assert.strictEqual(resolveLocale("ar", "en-US,en;q=0.9"), "ar");
    assert.strictEqual(resolveLocale("en", "ar-AE,ar;q=0.9"), "en");
  });

  test("falls back to the accept-language header", () => {
    assert.strictEqual(resolveLocale(undefined, "ar-AE,ar;q=0.9"), "ar");
    assert.strictEqual(resolveLocale("fr", "en-US,en;q=0.9"), "en");
  });

  test("returns the default locale when neither source is supported", () => {
    assert.strictEqual(resolveLocale(undefined, "fr-FR,fr;q=0.9"), defaultLocale);
    assert.strictEqual(resolveLocale(undefined, undefined), defaultLocale);
  });
});

describe("getDirection", () => {
  test("returns the correct direction", () => {
    assert.strictEqual(getDirection("en"), "ltr");
    assert.strictEqual(getDirection("ar"), "rtl");
  });
});

describe("buildHreflangAlternates", () => {
  test("builds root alternates", () => {
    const alternates = buildHreflangAlternates("");

    assert.strictEqual(alternates.en, "https://georgiahills.com/en");
    assert.strictEqual(alternates.ar, "https://georgiahills.com/ar");
    assert.strictEqual(alternates["x-default"], "https://georgiahills.com/en");
  });

  test("builds alternates for nested paths", () => {
    const alternates = buildHreflangAlternates("/about");

    assert.strictEqual(alternates.en, "https://georgiahills.com/en/about");
    assert.strictEqual(alternates.ar, "https://georgiahills.com/ar/about");
    assert.strictEqual(alternates["x-default"], "https://georgiahills.com/en/about");
  });

  test("normalizes paths without a leading slash", () => {
    const alternates = buildHreflangAlternates("contact");

    assert.strictEqual(alternates.en, "https://georgiahills.com/en/contact");
    assert.strictEqual(alternates.ar, "https://georgiahills.com/ar/contact");
  });
});import assert from "node:assert/strict";
import test, { describe, it } from "node:test";
import { resolveLocale, defaultLocale } from "./i18n.js";

describe("resolveLocale", () => {
  it("should return routeLocale if it is valid", () => {
    assert.equal(resolveLocale("en", undefined), "en");
    assert.equal(resolveLocale("ar", undefined), "ar");
    assert.equal(resolveLocale("en", "ar-AE"), "en"); // routeLocale takes precedence
  });

  it("should fall back to acceptLanguageHeader if routeLocale is invalid", () => {
    assert.equal(resolveLocale("fr", "ar-AE"), "ar");
    assert.equal(resolveLocale("invalid", "en-US"), "en");
    assert.equal(resolveLocale("", "ar"), "ar");
    assert.equal(resolveLocale(undefined, "en"), "en");
  });

  it("should return defaultLocale if both routeLocale and acceptLanguageHeader are invalid", () => {
    assert.equal(resolveLocale("fr", "es-ES"), defaultLocale);
    assert.equal(resolveLocale(undefined, "it-IT"), defaultLocale);
    assert.equal(resolveLocale(undefined, "unknown"), defaultLocale);
  });

  it("should parse acceptLanguageHeader correctly", () => {
    // Standard format
    assert.equal(resolveLocale(undefined, "ar-AE,ar;q=0.9,en-US;q=0.8,en;q=0.7"), "ar");

    // Space before the locale
    assert.equal(resolveLocale(undefined, " ar-SA"), "ar");

    // Subtags
    assert.equal(resolveLocale(undefined, "en-GB"), "en");
  });

  it("should return defaultLocale when no arguments are provided", () => {
    assert.equal(resolveLocale(), defaultLocale);
    assert.equal(resolveLocale(undefined, undefined), defaultLocale);
    assert.equal(resolveLocale(undefined, null), defaultLocale);
  });
});
