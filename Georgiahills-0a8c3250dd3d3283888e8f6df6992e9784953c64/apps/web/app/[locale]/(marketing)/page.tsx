import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { Destination } from "@gh/types";
import { GccApproxPrice } from "../../../components/GccApproxPrice.client";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { StructuredDataGraph } from "../../../components/StructuredData";
import { buildPageMetadata } from "../../../lib/seo";
import {
  buildHreflangAlternates,
  getMessages,
  isSupportedLocale,
  locales,
  type Locale
} from "../../../lib/i18n";

type LocalizedPageProps = {
  params: {
    locale: string;
  };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
  const locale = isSupportedLocale(params.locale) ? params.locale : "en";
  const messages = getMessages(locale);

  return buildPageMetadata({
    title: messages.title,
    description: messages.description,
    path: `/${locale}`,
    alternates: buildHreflangAlternates("")
  });
}

export default function LocalizedMarketingPage({ params }: LocalizedPageProps) {
  if (!isSupportedLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const messages = getMessages(locale);
  const baseTourPriceGel = 120;
  const conversionAsOf = "2026-03-03";

  const featuredDestination: Destination = {
    id: "tbilisi",
    slug: "tbilisi",
    name: "Tbilisi",
    country: "Georgia",
    shortDescription: "Historic old town and modern city energy.",
    featured: true
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <StructuredDataGraph
        nodes={[
          {
            type: "Breadcrumb",
            data: {
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: locale === "ar" ? "الرئيسية" : "Home",
                  item: `https://georgiahills.com/${locale}`
                }
              ]
            }
          },
          {
            type: "Organization",
            data: {
              sameAs: ["https://www.instagram.com", "https://www.tiktok.com"],
              contactPoint: [{ "@type": "ContactPoint", telephone: "+995579088537", contactType: "customer service" }]
            }
          },
          {
            type: "Product",
            data: {
              inLanguage: locale,
              name: locale === "ar" ? "جولة خاصة مع سائق في جورجيا" : "Private Georgia Tour With Driver",
              description: messages.description,
              brand: {
                "@type": "Brand",
                name: "Georgia Hills"
              },
              offers: {
                "@type": "Offer",
                priceCurrency: "GEL",
                price: `${baseTourPriceGel.toFixed(2)}`,
                priceValidUntil: "2026-12-31",
                availability: "https://schema.org/InStock",
                url: "https://georgiahills.com/booking"
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
                  name: locale === "ar" ? "هل تتوفر خدمة سائق خاص؟" : "Do you provide private driver service?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      locale === "ar"
                        ? "نعم، نقدم خدمة سائق خاص في مختلف وجهات جورجيا."
                        : "Yes, we provide private driver service across key destinations in Georgia."
                  }
                }
              ]
            }
          }
        ]}
      />
      <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-8 shadow-sm">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          <Sparkles className="h-4 w-4" />
          {messages.badge}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{messages.title}</h1>
        <p className="mt-2 text-slate-600">{messages.description}</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <OptimizedImage
            src="/hero-home-640.avif"
            alt={messages.imageAlt}
            width={512}
            height={288}
            className="h-auto w-full"
            priority
            withBlur={false}
            sizes="(max-width: 768px) calc(100vw - 128px), 512px"
            fetchPriority="high"
            quality={55}
          />
        </div>
        <p className="mt-2 text-sm text-slate-500">
          {messages.featuredLabel}: {featuredDestination.name}
        </p>
        <h2 className="mt-6 text-lg font-semibold text-slate-900">
          {locale === "ar" ? "لماذا يختار المسافرون العرب جورجيا هيلز؟" : "Why GCC travelers choose Georgia Hills"}
        </h2>
        <p className="mt-2 text-slate-600">
          {locale === "ar"
            ? "خطط مرنة، دعم عربي، وخدمة سائق خاص تناسب العائلات والرحلات الفاخرة في تبليسي وباتومي وكازبيجي وما بعدها."
            : "Flexible planning, Arabic support, and private driver service built for families and VIP travel across Tbilisi, Batumi, Kazbegi, and beyond."}
        </p>
        <GccApproxPrice
          locale={locale}
          baseGel={baseTourPriceGel}
          rates={{ SAR: 1.38, AED: 1.35 }}
          asOf={conversionAsOf}
        />
        <Link
          href="/booking"
          className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          {messages.button}
        </Link>
      </section>
    </main>
  );
}