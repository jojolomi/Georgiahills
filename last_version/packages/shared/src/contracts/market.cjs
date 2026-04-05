const MARKET_CODES = ["sa", "ae", "qa", "kw", "eg"];

const SOURCE_LANG_VALUES = ["en", "ar"];

function normalizeSourceLang(input) {
  return input === "ar" ? "ar" : "en";
}

function isSupportedMarket(input) {
  const code = String(input || "").toLowerCase();
  return MARKET_CODES.includes(code);
}

module.exports = {
  MARKET_CODES,
  SOURCE_LANG_VALUES,
  normalizeSourceLang,
  isSupportedMarket
};
