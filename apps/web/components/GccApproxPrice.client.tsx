"use client";

import { useEffect, useMemo, useState } from "react";

type SupportedCurrency = "SAR" | "AED";

type GccApproxPriceProps = {
  locale: "en" | "ar";
  baseGel: number;
  rates: Record<SupportedCurrency, number>;
  asOf: string;
};

function getDefaultCurrency(locale: "en" | "ar"): SupportedCurrency {
  return locale === "ar" ? "SAR" : "AED";
}

function readStoredCurrency(locale: "en" | "ar"): SupportedCurrency {
  if (typeof window === "undefined") return getDefaultCurrency(locale);
  const stored = window.localStorage.getItem("gh_currency");
  return stored === "SAR" || stored === "AED" ? stored : getDefaultCurrency(locale);
}

function formatAmount(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}

export function GccApproxPrice({ locale, baseGel, rates, asOf }: GccApproxPriceProps) {
  const [currency, setCurrency] = useState<SupportedCurrency>(() => readStoredCurrency(locale));

  useEffect(() => {
    const syncCurrency = () => setCurrency(readStoredCurrency(locale));

    syncCurrency();
    window.addEventListener("gh:currency-change", syncCurrency);
    window.addEventListener("storage", syncCurrency);

    return () => {
      window.removeEventListener("gh:currency-change", syncCurrency);
      window.removeEventListener("storage", syncCurrency);
    };
  }, [locale]);

  const approx = useMemo(() => {
    const rate = rates[currency] || 0;
    return Math.round(baseGel * rate);
  }, [baseGel, currency, rates]);

  const conversionNote =
    locale === "ar"
      ? `السعر الأساسي ${baseGel} GEL (حوالي ${formatAmount(approx)} ${currency}) — سعر تقريبي بناءً على تحويل ${asOf}.`
      : `Base price ${baseGel} GEL (about ${formatAmount(approx)} ${currency}) — approximate conversion as of ${asOf}.`;

  return <p className="mt-2 text-sm text-slate-500">{conversionNote}</p>;
}
