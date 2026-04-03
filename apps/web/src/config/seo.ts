import type { MarketConfig } from "./markets";
import type { SecondaryPage } from "./secondary-pages";
import { SITE } from "./site";
import { ensureSeoContract, type SeoContract } from "../components/seo/contract";
import { breadcrumbSchema, localBusinessSchema, pageSchemasForSecondary } from "../components/seo/schema-builders";
import type { SourceLang } from "@georgiahills/shared";
import { buildLocaleAlternates } from "@georgiahills/shared";

const defaultRobots = "index, follow, max-image-preview:large";
const defaultOgImage = `${SITE.domain}/image-1600.webp`;

function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.domain,
    telephone: "+995579088537"
  };
}

function buildHomeSeo(lang: SourceLang): SeoContract {
  const isAr = lang === "ar";
  const canonical = isAr ? `${SITE.domain}/arabic.html` : `${SITE.domain}/`;
  const title = isAr ? "سائق خاص في جورجيا | Georgia Hills" : "Private Driver in Georgia | Georgia Hills";
  const description = isAr
    ? "خدمة سائق خاص في جورجيا للعوائل والمسافرين من الخليج مع دعم عبر واتساب."
    : "Best private driver service in Georgia for families. Modern cars and English speaking drivers.";

  return ensureSeoContract(
    {
      lang,
      dir: isAr ? "rtl" : "ltr",
      title,
      description,
      canonical,
      hreflangs: Object.entries(buildLocaleAlternates({ siteUrl: SITE.domain, englishPath: `${SITE.domain}/`, arabicPath: `${SITE.domain}/arabic.html`, xDefaultPath: `${SITE.domain}/` }))
        .map(([hreflang, href]) => ({ hreflang, href })),
      ogImage: defaultOgImage,
      robots: defaultRobots,
      twitterCard: "summary_large_image",
      schemaGraph: [
        buildOrganizationSchema(),
        localBusinessSchema(canonical),
        {
          "@type": "WebPage",
          name: title,
          inLanguage: lang,
          url: canonical,
          description
        }
      ]
    },
    `home-${lang}`
  );
}

function buildBookingSeo(lang: SourceLang): SeoContract {
  const isAr = lang === "ar";
  const canonical = isAr ? `${SITE.domain}/booking-ar.html` : `${SITE.domain}/booking.html`;
  const title = isAr ? "احجز سائق خاص في جورجيا | Georgia Hills" : "Book Private Driver in Georgia | Georgia Hills";
  const description = isAr
    ? "احجز رحلتك في جورجيا مع تأكيد سريع عبر واتساب وأسعار واضحة."
    : "Book your private driver in Georgia with instant WhatsApp confirmation. Transparent pricing and 24/7 support.";

  return ensureSeoContract(
    {
      lang,
      dir: isAr ? "rtl" : "ltr",
      title,
      description,
      canonical,
      hreflangs: Object.entries(buildLocaleAlternates({ siteUrl: SITE.domain, englishPath: `${SITE.domain}/booking.html`, arabicPath: `${SITE.domain}/booking-ar.html`, xDefaultPath: `${SITE.domain}/booking.html` }))
        .map(([hreflang, href]) => ({ hreflang, href })),
      ogImage: defaultOgImage,
      robots: defaultRobots,
      twitterCard: "summary_large_image",
      schemaGraph: [
        buildOrganizationSchema(),
        localBusinessSchema(canonical),
        {
          "@type": "TouristTrip",
          name: isAr ? "حجز سائق خاص في جورجيا" : "Private Driver Booking in Georgia",
          description,
          provider: { "@type": "Organization", name: SITE.name },
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock"
          }
        },
        {
          "@type": "WebPage",
          name: title,
          inLanguage: lang,
          url: canonical,
          description
        }
      ]
    },
    `booking-${lang}`
  );
}

export const homeEnMeta = buildHomeSeo("en");
export const homeArMeta = buildHomeSeo("ar");
export const bookingEnMeta = buildBookingSeo("en");
export const bookingArMeta = buildBookingSeo("ar");

export function buildMarketMeta(market: MarketConfig): SeoContract {
  const canonical = `${SITE.domain}/${market.code}/`;
  return ensureSeoContract(
    {
      lang: "ar",
      dir: "rtl",
      title: market.pageTitle,
      description: market.description,
      canonical,
      hreflangs: Object.entries(buildLocaleAlternates({ siteUrl: SITE.domain, englishPath: `${SITE.domain}/`, arabicPath: canonical, xDefaultPath: `${SITE.domain}/` }))
        .map(([hreflang, href]) => ({ hreflang, href })),
      ogImage: defaultOgImage,
      robots: defaultRobots,
      twitterCard: "summary_large_image",
      schemaGraph: [
        buildOrganizationSchema(),
        localBusinessSchema(canonical),
        {
          "@type": "TouristTrip",
          name: `رحلات جورجيا للمسافرين من ${market.countryAr}`,
          description: market.ogDescription
        },
        breadcrumbSchema([
          { name: "الرئيسية", item: `${SITE.domain}/arabic.html` },
          { name: market.countryAr, item: canonical }
        ])
      ]
    },
    `market-${market.code}`
  );
}

export function buildSecondaryMeta(page: SecondaryPage, pairedCanonical?: string): SeoContract {
  const alternates = buildLocaleAlternates({
    siteUrl: SITE.domain,
    englishPath: page.lang === "en" ? page.canonical : pairedCanonical || `${SITE.domain}/`,
    arabicPath: page.lang === "ar" ? page.canonical : pairedCanonical || `${SITE.domain}/`,
    xDefaultPath: `${SITE.domain}/`
  });
  const hreflangs = Object.entries(alternates).map(([hreflang, href]) => ({ hreflang, href }));

  return ensureSeoContract(
    {
      lang: page.lang,
      dir: page.dir,
      title: page.title,
      description: page.description,
      canonical: page.canonical,
      hreflangs,
      ogImage: defaultOgImage,
      robots: defaultRobots,
      twitterCard: "summary_large_image",
      schemaGraph: pageSchemasForSecondary(page)
    },
    `secondary-${page.slug}`
  );
}
