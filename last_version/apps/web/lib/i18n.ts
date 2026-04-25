import en from "../messages/en.json";
import ar from "../messages/ar.json";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

const messages = {
  en,
  ar
} as const;

export function isSupportedLocale(input: string): input is Locale {
  return locales.includes(input as Locale);
}

export function detectLocale(input?: string | null): Locale {
  if (!input) return defaultLocale;
  const normalized = input.toLowerCase().split("-")[0];
  return isSupportedLocale(normalized) ? normalized : defaultLocale;
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
  if (!pathname || pathname === "/") return "";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function buildHreflangAlternates(pathname = "") {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://georgiahills.com";
  const suffix = normalizePath(pathname);

  return {
    en: `${siteUrl}/en${suffix}`,
    ar: `${siteUrl}/ar${suffix}`,
    "x-default": `${siteUrl}/en${suffix}`
  };
}