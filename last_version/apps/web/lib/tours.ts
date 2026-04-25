import toursData from "../content/tours.json";
import type { Locale } from "./i18n";

type LocalizedTourCopy = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  question: string;
  answer: string;
  highlights: string[];
};

export type TourRecord = {
  slug: string;
  image: string;
  updatedAt?: string;
  en: LocalizedTourCopy;
  ar: LocalizedTourCopy;
};

const tours = toursData as TourRecord[];

export function getTourSlugs() {
  return tours.map((tour) => tour.slug);
}

export function getTourBySlug(slug: string) {
  return tours.find((tour) => tour.slug === slug);
}

export function getLocalizedTour(slug: string, locale: Locale) {
  const tour = getTourBySlug(slug);
  if (!tour) {
    return undefined;
  }

  const localized = locale === "ar" ? tour.ar : tour.en;
  return { ...tour, localized };
}
