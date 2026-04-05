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

type HreflangOptions = {
  englishPath?: string;
  arabicPath?: string;
  xDefaultPath?: string;
  includeEnglish?: boolean;
  includeArabic?: boolean;
};

function toAbsoluteUrl(siteUrl: string, value?: string) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${siteUrl}${normalized}`;
}

export function buildHreflangAlternates(pathname = "", options: HreflangOptions = {}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://georgiahills.com";
  const baseAlternates = buildLocaleAlternates({
    siteUrl,
    pathname: normalizePath(pathname),
    englishPath: toAbsoluteUrl(siteUrl, options.englishPath),
    arabicPath: toAbsoluteUrl(siteUrl, options.arabicPath),
    xDefaultPath: toAbsoluteUrl(siteUrl, options.xDefaultPath)
  });

  const alternates: Record<string, string> = {
    "x-default": baseAlternates["x-default"]
  };

  if (options.includeEnglish !== false) {
    alternates.en = baseAlternates.en;
  }

  if (options.includeArabic !== false) {
    alternates.ar = baseAlternates.ar;
  }

  return alternates;
}