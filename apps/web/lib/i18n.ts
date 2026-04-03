import en from "../messages/en.json";
import ar from "../messages/ar.json";
import {
  DEFAULT_LOCALE,
  SOURCE_LOCALES,
  buildLocaleAlternates,
  normalizeLocale
} from "@georgiahills/shared";

export const locales = SOURCE_LOCALES;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = DEFAULT_LOCALE;

const messages = {
  en,
  ar
} as const;

export function isSupportedLocale(input: string): input is Locale {
  return SOURCE_LOCALES.includes(String(input || "").toLowerCase() as Locale);
}

export function detectLocale(input?: string | null): Locale {
  if (!input) return defaultLocale;
  return normalizeLocale(input);
}

export function resolveLocale(routeLocale?: string, acceptLanguageHeader?: string | null): Locale {
  if (routeLocale && isSupportedLocale(routeLocale)) {
    return routeLocale;
  }

  if (acceptLanguageHeader) {
    const first = acceptLanguageHeader.split(",")[0]?.trim();
    return detectLocale(first);
  }

  return defaultLocale;
}

export function getMessages(locale: Locale) {
  return messages[locale];
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

function normalizePath(pathname = "") {
  return pathname;
}

export function buildHreflangAlternates(pathname = "") {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://georgiahills.com";
  return buildLocaleAlternates({ siteUrl, pathname: normalizePath(pathname) });
}