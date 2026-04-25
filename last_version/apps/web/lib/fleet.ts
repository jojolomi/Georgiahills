import fleetData from "../content/fleet.json";
import type { Locale } from "./i18n";

type LocalizedFleetCopy = {
  name: string;
  title: string;
  description: string;
  h1: string;
  summary: string;
  question: string;
  answer: string;
};

export type FleetRecord = {
  slug: string;
  image: string;
  priceGel: number;
  updatedAt?: string;
  en: LocalizedFleetCopy;
  ar: LocalizedFleetCopy;
};

const fleet = fleetData as FleetRecord[];

export function getFleetSlugs() {
  return fleet.map((item) => item.slug);
}

export function getFleetBySlug(slug: string) {
  return fleet.find((item) => item.slug === slug);
}

export function getLocalizedFleet(slug: string, locale: Locale) {
  const item = getFleetBySlug(slug);
  if (!item) return undefined;

  const localized = locale === "ar" ? item.ar : item.en;
  return { ...item, localized };
}
