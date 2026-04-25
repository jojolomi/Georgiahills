import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OptimizedImage } from "../../../../components/OptimizedImage";
import { StructuredDataGraph } from "../../../../components/StructuredData";
import { buildHreflangAlternates, isSupportedLocale, locales, type Locale } from "../../../../lib/i18n";
import { buildPageMetadata } from "../../../../lib/seo";
import { getLocalizedTour, getTourSlugs } from "../../../../lib/tours";

type TourPageParams = {
  locale: string;
  slug: string;
};

type TourPageProps = {
  params: TourPageParams;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://georgiahills.com";

export function generateStaticParams() {
  const slugs = getTourSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const locale = isSupportedLocale(params.locale) ? (params.locale as Locale) : "en";
  const tour = getLocalizedTour(params.slug, locale);

  if (!tour) {
    return {
      title: locale === "ar" ? "البرنامج غير متوفر" : "Tour Not Found"
    };
  }

  return buildPageMetadata({
    title: tour.localized.title,
    description: tour.localized.description,
    path: `/${locale}/tours/${tour.slug}`,
    alternates: buildHreflangAlternates(`/tours/${tour.slug}`),
    images: [tour.image]
  });
}

export default function TourPage({ params }: TourPageProps) {
  if (!isSupportedLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const tour = getLocalizedTour(params.slug, locale);

  if (!tour) {
    notFound();
  }

  const isArabic = locale === "ar";
  const canonicalPath = `${siteUrl}/${locale}/tours/${tour.slug}`;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <StructuredDataGraph
        nodes={[
          {
            type: "TouristTrip",
            data: {
              inLanguage: locale,
              name: tour.localized.h1,
              description: tour.localized.description,
              itinerary: tour.localized.intro,
              touristType: isArabic ? "العائلات والمسافرون من الخليج" : "Families and GCC travelers",
              image: [`${siteUrl}${tour.image}`],
              offers: {
                "@type": "Offer",
                priceCurrency: "GEL",
                price: "120",
                availability: "https://schema.org/InStock",
                url: canonicalPath
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
                  name: tour.localized.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: tour.localized.answer
                  }
                }
              ]
            }
          },
          {
            type: "Breadcrumb",
            data: {
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: isArabic ? "الرئيسية" : "Home",
                  item: `${siteUrl}/${locale}`
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: isArabic ? "الجولات" : "Tours",
                  item: `${siteUrl}/${locale}/tours`
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: tour.localized.h1,
                  item: canonicalPath
                }
              ]
            }
          }
        ]}
      />

      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-emerald-700">{isArabic ? "جولات مخصصة" : "Custom Tours"}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{tour.localized.h1}</h1>
        <p className="mt-3 text-base leading-7 text-slate-700">{tour.localized.intro}</p>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <OptimizedImage
            src={tour.image}
            alt={tour.localized.h1}
            width={1024}
            height={640}
            className="h-auto w-full"
            priority
            withBlur
            sizes="(max-width: 1024px) 100vw, 1024px"
            fetchPriority="high"
          />
        </div>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">{tour.localized.question}</h2>
        <p className="mt-3 text-base leading-7 text-slate-700">{tour.localized.answer}</p>

        <h2 className="mt-8 text-xl font-semibold text-slate-900">{isArabic ? "أبرز النقاط" : "Key Highlights"}</h2>
        <ul className="mt-3 list-disc space-y-2 ps-5 text-base leading-7 text-slate-700">
          {tour.localized.highlights.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <a
          href={`https://wa.me/995579088537?text=${encodeURIComponent(
            isArabic
              ? `مرحبًا، أريد تفاصيل ${tour.localized.h1} وعدد ${isArabic ? "الأشخاص" : "travelers"}`
              : `Hello, I want details for ${tour.localized.h1} with private driver`
          )}`}
          className="mt-8 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          {isArabic ? "احجز عبر واتساب" : "Book on WhatsApp"}
        </a>
      </section>
    </main>
  );
}
