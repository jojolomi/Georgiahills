export const MARKET_CODES = ["sa", "ae", "qa", "kw", "eg"];

export const SOURCE_LANG_VALUES = ["en", "ar"];

export function normalizeSourceLang(input) {
  return input === "ar" ? "ar" : "en";
}

export function isSupportedMarket(input) {
  const code = String(input || "").toLowerCase();
  return MARKET_CODES.includes(code);
}
