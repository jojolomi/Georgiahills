import assert from "node:assert/strict";
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
