import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fleetData from "../../../content/fleet.json";
import { StructuredDataGraph } from "../../../components/StructuredData";
import { buildHreflangAlternates, isSupportedLocale, locales, type Locale } from "../../../lib/i18n";
import { buildPageMetadata } from "../../../lib/seo";
import type { FleetRecord } from "../../../lib/fleet";

type FleetListingProps = {
  params: {
    locale: string;
  };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://georgiahills.com";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: FleetListingProps): Promise<Metadata> {
  const locale = isSupportedLocale(params.locale) ? (params.locale as Locale) : "en";

  return buildPageMetadata({
    title: locale === "ar" ? "أسطول السيارات الخاصة | Georgia Hills" : "Private Fleet Options | Georgia Hills",
    description:
      locale === "ar"
        ? "تعرف على خيارات السيدان والميني فان والفئات الفاخرة مع تسعير واضح وخدمة سائق خاص."
        : "Choose from sedan, VIP minivan, and luxury classes with private chauffeur service and transparent pricing.",
    path: `/${locale}/fleet`,
    alternates: buildHreflangAlternates("/fleet")
  });
}

export default function FleetListingPage({ params }: FleetListingProps) {
  if (!isSupportedLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const isArabic = locale === "ar";
  const fleet = fleetData as FleetRecord[];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <StructuredDataGraph
        nodes={[
          {
            type: "Service",
            data: {
              name: isArabic ? "خدمة السائق الخاص" : "Private Driver Service",
              provider: {
                "@type": "Organization",
                name: "Georgia Hills"
              },
              areaServed: "Georgia",
              inLanguage: locale
            }
          },
          {
            type: "Breadcrumb",
            data: {
              itemListElement: [
                { "@type": "ListItem", position: 1, name: isArabic ? "الرئيسية" : "Home", item: `${siteUrl}/${locale}` },
                { "@type": "ListItem", position: 2, name: isArabic ? "الأسطول" : "Fleet", item: `${siteUrl}/${locale}/fleet` }
              ]
            }
          }
        ]}
      />
      <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {isArabic ? "أسطول Georgia Hills الخاص" : "Georgia Hills Private Fleet"}
        </h1>
        <h2 className="mt-4 text-xl font-semibold text-slate-900">
          {isArabic ? "اختر الفئة المناسبة لعدد المسافرين ومستوى الراحة" : "Choose the right class for comfort and group size"}
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fleet.map((item) => {
            const copy = isArabic ? item.ar : item.en;
            return (
              <article key={item.slug} className="rounded-xl border border-slate-200 p-4">
                <h3 className="text-lg font-semibold text-slate-900">{copy.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{copy.summary}</p>
                <p className="mt-3 text-sm font-medium text-emerald-700">
                  {isArabic ? `ابتداءً من ${item.priceGel} GEL` : `From ${item.priceGel} GEL`}
                </p>
                <Link
                  href={`/${locale}/fleet/${item.slug}`}
                  className="mt-4 inline-flex rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                >
                  {isArabic ? "عرض التفاصيل" : "View Details"}
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
