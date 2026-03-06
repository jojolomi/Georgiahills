import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { isSupportedLocale, detectLocale, locales, defaultLocale, resolveLocale, getDirection, normalizePath, buildHreflangAlternates } from "./i18n.ts";

describe("isSupportedLocale", () => {
  test("should return true for supported locales", () => {
    assert.strictEqual(isSupportedLocale("en"), true);
    assert.strictEqual(isSupportedLocale("ar"), true);
  });

  test("should return false for unsupported locales", () => {
    assert.strictEqual(isSupportedLocale("fr"), false);
    assert.strictEqual(isSupportedLocale("es"), false);
  });

  test("should return false for empty strings and invalid inputs", () => {
    assert.strictEqual(isSupportedLocale(""), false);
    assert.strictEqual(isSupportedLocale("en-US"), false);
  });
});

describe("detectLocale", () => {
  test("should return the exact supported locale", () => {
    assert.strictEqual(detectLocale("en"), "en");
    assert.strictEqual(detectLocale("ar"), "ar");
  });

  test("should handle normalized locales (e.g. en-US to en)", () => {
    assert.strictEqual(detectLocale("en-US"), "en");
    assert.strictEqual(detectLocale("en-GB"), "en");
    assert.strictEqual(detectLocale("ar-AE"), "ar");
    assert.strictEqual(detectLocale("ar-SA"), "ar");
  });

  test("should return defaultLocale for unsupported locales", () => {
    assert.strictEqual(detectLocale("fr"), defaultLocale);
    assert.strictEqual(detectLocale("es"), defaultLocale);
    assert.strictEqual(detectLocale("fr-FR"), defaultLocale);
  });

  test("should handle empty or nullish inputs", () => {
    assert.strictEqual(detectLocale(""), defaultLocale);
    assert.strictEqual(detectLocale(null), defaultLocale);
    assert.strictEqual(detectLocale(undefined), defaultLocale);
  });
});

describe("resolveLocale", () => {
  test("should return routeLocale if it is supported", () => {
    assert.strictEqual(resolveLocale("ar", null), "ar");
    assert.strictEqual(resolveLocale("en", "fr-CH, fr;q=0.9"), "en");
  });

  test("should detect from acceptLanguageHeader if routeLocale is unsupported or empty", () => {
    assert.strictEqual(resolveLocale(undefined, "ar-AE, ar;q=0.9"), "ar");
    assert.strictEqual(resolveLocale("fr", "en-US, en;q=0.9"), "en");
  });

  test("should return defaultLocale if neither provides a supported locale", () => {
    assert.strictEqual(resolveLocale(undefined, "fr-FR, fr;q=0.9"), defaultLocale);
    assert.strictEqual(resolveLocale("es", "it-IT, it;q=0.9"), defaultLocale);
    assert.strictEqual(resolveLocale(undefined, undefined), defaultLocale);
  });
});

describe("getDirection", () => {
  test("should return rtl for Arabic", () => {
    assert.strictEqual(getDirection("ar"), "rtl");
  });

  test("should return ltr for English", () => {
    assert.strictEqual(getDirection("en"), "ltr");
  });
});

describe("buildHreflangAlternates", () => {
  test("should build correct alternates for root path", () => {
    const alternates = buildHreflangAlternates("");
    assert.strictEqual(alternates.en, "https://georgiahills.com/en");
    assert.strictEqual(alternates.ar, "https://georgiahills.com/ar");
    assert.strictEqual(alternates["x-default"], "https://georgiahills.com/en");
  });

  test("should build correct alternates for given path", () => {
    const alternates = buildHreflangAlternates("/about");
    assert.strictEqual(alternates.en, "https://georgiahills.com/en/about");
    assert.strictEqual(alternates.ar, "https://georgiahills.com/ar/about");
    assert.strictEqual(alternates["x-default"], "https://georgiahills.com/en/about");
  });

  test("should correctly normalize paths missing a leading slash", () => {
    const alternates = buildHreflangAlternates("contact");
    assert.strictEqual(alternates.en, "https://georgiahills.com/en/contact");
    assert.strictEqual(alternates.ar, "https://georgiahills.com/ar/contact");
  });
});
