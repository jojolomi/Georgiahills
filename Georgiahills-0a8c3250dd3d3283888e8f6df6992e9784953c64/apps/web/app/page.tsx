import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildHreflangAlternates } from "../lib/i18n";
import { buildPageMetadata } from "../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Georgia Hills — Private Tours & Chauffeur Service",
  description:
    "Plan your Georgia trip with private chauffeur tours, multilingual support, and custom itineraries for Tbilisi, Batumi, Kazbegi, and beyond.",
  path: "/",
  alternates: buildHreflangAlternates(""),
  images: ["/hero-home-1600.avif"]
});

export default function HomePage() {
  redirect("/en");
}
