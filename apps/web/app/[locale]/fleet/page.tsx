import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Gauge, ShieldCheck, Sparkles, Users } from "lucide-react";
import fleetData from "../../../content/fleet.json";
import { OptimizedImage } from "../../../components/OptimizedImage";
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
    alternates: buildHreflangAlternates("/fleet"),
    images: ["/hero-home-1600.avif"]
  });
}

export default function FleetListingPage({ params }: FleetListingProps) {
  if (!isSupportedLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const isArabic = locale === "ar";
  const fleet = fleetData as FleetRecord[];
  const featuredFleet = fleet.slice(0, 3);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.2),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_26%),linear-gradient(180deg,_#020617_0%,_#0f172a_44%,_#f8fafc_44%,_#f8fafc_100%)]" />
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

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
              <Sparkles className="h-3.5 w-3.5" />
              {isArabic ? "الأسطول" : "Fleet"}
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {isArabic ? "أسطول واضح ومناسب للعائلات والمسافرين من الخليج" : "A clear fleet built for families and GCC travelers"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {isArabic
                ? "اختر السيارة على أساس السعة والراحة ونوع الرحلة. كل بطاقة هنا توضح الفئة والسعر من البداية لتسهيل القرار."
                : "Choose a vehicle based on capacity, comfort, and trip style. Each card shows the class and price up front to simplify the decision."}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                {isArabic ? "احجز الآن" : "Book now"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {isArabic ? "العودة للرئيسية" : "Back to home"}
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: isArabic ? "حسب عدد المسافرين" : "Sized by travelers",
                  text: isArabic ? "سيدان، ميني فان، وفئات فاخرة." : "Sedan, minivan, and premium classes."
                },
                {
                  icon: Gauge,
                  title: isArabic ? "راحة الرحلة" : "Comfort-first",
                  text: isArabic ? "اختيار واضح حسب مستوى الراحة." : "Clear selection by comfort level."
                },
                {
                  icon: ShieldCheck,
                  title: isArabic ? "تسعير شفاف" : "Transparent pricing",
                  text: isArabic ? "التكلفة تظهر قبل الانتقال للتفاصيل." : "Pricing appears before the detail page."
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-base font-semibold text-white">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-emerald-500/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl shadow-slate-950/20">
              <div className="relative aspect-[16/10]">
                <OptimizedImage
                  src={featuredFleet[1]?.image || fleet[0]?.image || "/image-1600.avif"}
                  alt={isArabic ? "أسطول Georgia Hills" : "Georgia Hills fleet"}
                  fill
                  className="object-cover"
                  priority
                  withBlur={false}
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  fetchPriority="high"
                  quality={62}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.05)_0%,rgba(2,6,23,0.14)_52%,rgba(2,6,23,0.82)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                    {isArabic ? "فئات جاهزة للحجز" : "Ready-to-book classes"}
                  </div>
                  <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur">
                    <p className="text-sm leading-6 text-slate-300">
                      {isArabic
                        ? "ابدأ من الفئة المناسبة ثم انتقل إلى صفحة التفاصيل أو استخدم نموذج الحجز لاختيار الرحلة المثالية."
                        : "Start with the right class, then move to the detail page or booking form to finalize the trip."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-900 shadow-xl shadow-slate-900/5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                {isArabic ? "الفئات الرئيسية" : "Core classes"}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {isArabic ? "ابدأ بالفئة التي تطابق سعة مجموعتك" : "Start with the class that matches your group size"}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              {isArabic
                ? "الأسطول هنا مصمم ليجعل القرار سريعًا وواضحًا، مع الدخول إلى تفاصيل كل سيارة عند الحاجة."
                : "The fleet page is designed to make the choice quick and clear, with detail pages available when needed."}
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {fleet.map((item) => {
              const copy = isArabic ? item.ar : item.en;
              return (
                <article key={item.slug} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
                  <div className="relative aspect-[16/10]">
                    <OptimizedImage
                      src={item.image}
                      alt={copy.h1}
                      fill
                      className="object-cover"
                      withBlur={false}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      quality={60}
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-sm font-semibold text-emerald-700">{copy.name}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950">{copy.h1}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{copy.summary}</p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">
                      {isArabic ? `ابتداءً من ${item.priceGel} GEL` : `From ${item.priceGel} GEL`}
                    </div>
                    <Link
                      href={`/${locale}/fleet/${item.slug}`}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      {isArabic ? "عرض التفاصيل" : "View details"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {isArabic ? "خطوة سريعة بعد الاختيار" : "Next step after choosing"}
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-950/90">
              {isArabic
                ? "بعد اختيار السيارة، انتقل إلى نموذج الحجز أو واتساب لإرسال خطتك النهائية خلال دقائق."
                : "After choosing a vehicle, move to the booking form or WhatsApp to send your final plan within minutes."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
