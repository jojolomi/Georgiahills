export const SOURCE_LOCALES: readonly ["en", "ar"];
export const DEFAULT_LOCALE: "en";

export type SupportedLocale = (typeof SOURCE_LOCALES)[number];

export function normalizeLocale(input: unknown): SupportedLocale;
export function isSupportedLocale(input: unknown): boolean;
export function normalizePathname(pathname?: string): string;

export function buildLocaleAlternates(input: {
  siteUrl: string;
  englishPath?: string;
  arabicPath?: string;
  xDefaultPath?: string;
  pathname?: string;
}): {
  en: string;
  ar: string;
  "x-default": string;
};
