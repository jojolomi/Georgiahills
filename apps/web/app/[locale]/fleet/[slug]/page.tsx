import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Gauge, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
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
  const whatsappMessage = isArabic
    ? `مرحبًا، أريد حجز ${fleet.localized.name} مع سائق خاص في جورجيا.`
    : `Hello, I want to book ${fleet.localized.name} with a private driver in Georgia.`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_26%),linear-gradient(180deg,_#020617_0%,_#0f172a_44%,_#f8fafc_44%,_#f8fafc_100%)]" />

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

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
              <Sparkles className="h-3.5 w-3.5" />
              {isArabic ? "خدمة سائق خاص" : "Private chauffeur"}
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {fleet.localized.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{fleet.localized.summary}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/995579088537?text=${encodeURIComponent(whatsappMessage)}`}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                <ArrowRight className="h-4 w-4 rotate-90" />
                {isArabic ? "اطلب عرض السعر عبر واتساب" : "Get quote on WhatsApp"}
              </a>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {isArabic ? "أكمل الحجز" : "Complete booking"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: isArabic ? "سعة مناسبة" : "Right-sized capacity",
                  text: isArabic ? "اختيار واضح للعائلات والمجموعات الصغيرة." : "A clear fit for families and small groups."
                },
                {
                  icon: Gauge,
                  title: isArabic ? "راحة أعلى" : "Comfort-first",
                  text: isArabic ? "من المدينة إلى الجبال بدون تعقيد." : "City-to-mountain comfort without friction."
                },
                {
                  icon: ShieldCheck,
                  title: isArabic ? "تنقل موثوق" : "Reliable transfer",
                  text: isArabic ? "سعر واضح وخدمة قابلة للحجز بسرعة." : "Clear pricing and quick booking."
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
                  src={fleet.image}
                  alt={fleet.localized.name}
                  fill
                  className="object-cover"
                  priority
                  withBlur={false}
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  fetchPriority="high"
                  quality={64}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.05)_0%,rgba(2,6,23,0.14)_48%,rgba(2,6,23,0.82)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
                    <Star className="h-3.5 w-3.5 text-emerald-300" />
                    {isArabic ? "فئة السيارة" : "Vehicle class"}
                  </div>
                  <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur">
                    <p className="text-sm leading-6 text-slate-300">{fleet.localized.description}</p>
                    <p className="mt-3 text-sm font-semibold text-emerald-300">
                      {isArabic ? `السعر يبدأ من ${fleet.priceGel} GEL` : `Starting from ${fleet.priceGel} GEL`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-900 shadow-xl shadow-slate-900/5 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                {isArabic ? "خلاصة الخدمة" : "Service summary"}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {isArabic ? "احصل على فهم سريع قبل الحجز" : "Get a quick understanding before booking"}
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">{fleet.localized.answer}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-emerald-700">{isArabic ? "الوصف" : "Overview"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{fleet.localized.summary}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-emerald-700">{isArabic ? "مناسب لـ" : "Best for"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {isArabic ? "العائلات، الأزواج، والتنقلات الخاصة." : "Families, couples, and private transfers."}
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-emerald-700">{isArabic ? "اللغة" : "Language"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{isArabic ? "دعم عربي وإنجليزي." : "Arabic and English support."}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-emerald-700">{isArabic ? "التسعير" : "Pricing"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{isArabic ? `ابتداءً من ${fleet.priceGel} GEL` : `Starting from ${fleet.priceGel} GEL`}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-900 shadow-xl shadow-slate-900/5 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              {isArabic ? "الأسباب الرئيسية" : "Key reasons"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {isArabic ? "ماذا يميز هذه الفئة؟" : "What makes this class useful?"}
            </h2>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-700">
              {fleet.localized.answer
                ? [
                    isArabic ? "مستوى راحة واضح" : "Clear comfort level",
                    isArabic ? "حجز سهل وسريع" : "Easy, fast booking",
                    isArabic ? "توافق مع الرحلات الخاصة" : "Fits private trips well"
                  ].map((point) => (
                    <li key={point} className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{point}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">{isArabic ? "سؤال شائع" : "Common question"}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">{fleet.localized.question}</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">{fleet.localized.answer}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/995579088537?text=${encodeURIComponent(whatsappMessage)}`}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                <ArrowRight className="h-4 w-4 rotate-90" />
                {isArabic ? "اطلب عرض السعر عبر واتساب" : "Get quote on WhatsApp"}
              </a>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {isArabic ? "أكمل الحجز" : "Complete booking"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
