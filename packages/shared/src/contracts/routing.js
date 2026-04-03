export const SOURCE_LOCALES = ["en", "ar"];
export const DEFAULT_LOCALE = "en";

export function normalizeLocale(input) {
  const normalized = String(input || "").trim().toLowerCase().split("-")[0];
  return normalized === "ar" ? "ar" : DEFAULT_LOCALE;
}

export function isSupportedLocale(input) {
  const normalized = String(input || "").trim().toLowerCase().split("-")[0];
  return SOURCE_LOCALES.includes(normalized);
}

export function normalizePathname(pathname = "") {
  if (!pathname || pathname === "/") return "";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function buildLocaleAlternates({ siteUrl, englishPath, arabicPath, xDefaultPath, pathname = "" }) {
  const suffix = normalizePathname(pathname);
  const enHref = englishPath || `${siteUrl}/en${suffix}`;
  const arHref = arabicPath || `${siteUrl}/ar${suffix}`;
  const xDefaultHref = xDefaultPath || enHref;

  return {
    en: enHref,
    ar: arHref,
    "x-default": xDefaultHref
  };
}
