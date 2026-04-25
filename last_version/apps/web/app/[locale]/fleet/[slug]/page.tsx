import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OptimizedImage } from "../../../../components/OptimizedImage";
import { StructuredDataGraph } from "../../../../components/StructuredData";
import { buildHreflangAlternates, isSupportedLocale, locales, type Locale } from "../../../../lib/i18n";
import { buildPageMetadata } from "../../../../lib/seo";
import { getFleetSlugs, getLocalizedFleet } from "../../../../lib/fleet";

type FleetPageProps = {
  params: {
    locale: string;
    slug: string;
  };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://georgiahills.com";

export function generateStaticParams() {
  const slugs = getFleetSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: FleetPageProps): Promise<Metadata> {
  const locale = isSupportedLocale(params.locale) ? (params.locale as Locale) : "en";
  const fleet = getLocalizedFleet(params.slug, locale);

  if (!fleet) {
    return {
      title: locale === "ar" ? "الخدمة غير متوفرة" : "Service Not Found"
    };
  }

  return buildPageMetadata({
    title: fleet.localized.title,
    description: fleet.localized.description,
    path: `/${locale}/fleet/${fleet.slug}`,
    alternates: buildHreflangAlternates(`/fleet/${fleet.slug}`),
    images: [fleet.image]
  });
}

export default function FleetDetailPage({ params }: FleetPageProps) {
  if (!isSupportedLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const isArabic = locale === "ar";
  const fleet = getLocalizedFleet(params.slug, locale);

  if (!fleet) {
    notFound();
  }

  const detailUrl = `${siteUrl}/${locale}/fleet/${fleet.slug}`;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <StructuredDataGraph
        nodes={[
          {
            type: "Product",
            data: {
              inLanguage: locale,
              name: fleet.localized.name,
              description: fleet.localized.description,
              image: [`${siteUrl}${fleet.image}`],
              offers: {
                "@type": "Offer",
                priceCurrency: "GEL",
                price: fleet.priceGel,
                availability: "https://schema.org/InStock",
                url: detailUrl
              },
              brand: {
                "@type": "Brand",
                name: "Georgia Hills"
              }
            }
          },
          {
            type: "Service",
            data: {
              inLanguage: locale,
              name: isArabic ? `خدمة ${fleet.localized.name}` : `${fleet.localized.name} Chauffeur Service`,
              provider: {
                "@type": "Organization",
                name: "Georgia Hills"
              },
              areaServed: "Georgia",
              offers: {
                "@type": "Offer",
                priceCurrency: "GEL",
                price: fleet.priceGel,
                availability: "https://schema.org/InStock",
                url: detailUrl
              }
            }
          },
          {
            type: "FAQ",
            data: {
              inLanguage: locale,
              mainEntity: [
                {
                  "@type": "Question",
                  name: fleet.localized.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: fleet.localized.answer
                  }
                }
              ]
            }
          },
          {
            type: "Breadcrumb",
            data: {
              itemListElement: [
                { "@type": "ListItem", position: 1, name: isArabic ? "الرئيسية" : "Home", item: `${siteUrl}/${locale}` },
                { "@type": "ListItem", position: 2, name: isArabic ? "الأسطول" : "Fleet", item: `${siteUrl}/${locale}/fleet` },
                { "@type": "ListItem", position: 3, name: fleet.localized.name, item: detailUrl }
              ]
            }
          }
        ]}
      />

      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-emerald-700">{isArabic ? "خدمة سائق خاص" : "Private Chauffeur"}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{fleet.localized.h1}</h1>
        <p className="mt-3 text-base leading-7 text-slate-700">{fleet.localized.summary}</p>
        <p className="mt-4 text-base font-medium text-slate-900">
          {isArabic ? `السعر يبدأ من ${fleet.priceGel} GEL` : `Starting from ${fleet.priceGel} GEL`}
        </p>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <OptimizedImage
            src={fleet.image}
            alt={fleet.localized.name}
            width={1024}
            height={640}
            className="h-auto w-full"
            priority
            withBlur
            sizes="(max-width: 1024px) 100vw, 1024px"
            fetchPriority="high"
          />
        </div>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">{fleet.localized.question}</h2>
        <p className="mt-3 text-base leading-7 text-slate-700">{fleet.localized.answer}</p>

        <a
          href={`https://wa.me/995579088537?text=${encodeURIComponent(
            isArabic
              ? `مرحبًا، أريد حجز ${fleet.localized.name} مع سائق خاص في جورجيا.`
              : `Hello, I want to book ${fleet.localized.name} with a private driver in Georgia.`
          )}`}
          className="mt-8 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          {isArabic ? "اطلب عرض السعر عبر واتساب" : "Get Quote on WhatsApp"}
        </a>
      </section>
    </main>
  );
}
