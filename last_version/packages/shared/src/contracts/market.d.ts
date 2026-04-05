export const MARKET_CODES: readonly ["sa", "ae", "qa", "kw", "eg"];

export const SOURCE_LANG_VALUES: readonly ["en", "ar"];

export type SourceLang = (typeof SOURCE_LANG_VALUES)[number];

export function normalizeSourceLang(input: unknown): SourceLang;

export function isSupportedMarket(input: unknown): boolean;
