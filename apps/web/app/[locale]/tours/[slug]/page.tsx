import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock3, MapPin, MessageCircle, ShieldCheck, Sparkles, Star } from "lucide-react";
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
  const whatsappMessage = isArabic
    ? `مرحبًا، أريد تفاصيل ${tour.localized.h1} وعدد الأشخاص وخطة مناسبة للعائلة.`
    : `Hello, I want details for ${tour.localized.h1} with a private driver and a family-friendly plan.`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_26%),linear-gradient(180deg,_#020617_0%,_#0f172a_44%,_#f8fafc_44%,_#f8fafc_100%)]" />

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
                { "@type": "ListItem", position: 1, name: isArabic ? "الرئيسية" : "Home", item: `${siteUrl}/${locale}` },
                { "@type": "ListItem", position: 2, name: isArabic ? "الجولات" : "Tours", item: `${siteUrl}/${locale}` },
                { "@type": "ListItem", position: 3, name: tour.localized.h1, item: canonicalPath }
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
              {isArabic ? "جولة مميزة" : "Featured route"}
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {tour.localized.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{tour.localized.intro}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/995579088537?text=${encodeURIComponent(whatsappMessage)}`}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                <MessageCircle className="h-4 w-4" />
                {isArabic ? "احجز عبر واتساب" : "Book on WhatsApp"}
              </a>
              <Link
                href={`/${locale}/fleet`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {isArabic ? "اختر السيارة" : "Choose vehicle"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: MapPin,
                  title: isArabic ? "نقاط واضحة" : "Clear stops",
                  text: isArabic ? "محطات أساسية ومسار سهل المتابعة." : "Key stops and an easy-to-follow route."
                },
                {
                  icon: Clock3,
                  title: isArabic ? "توقيت مرن" : "Flexible timing",
                  text: isArabic ? "مناسب للعائلات والخصوصية والراحة." : "Designed for family comfort and privacy."
                },
                {
                  icon: ShieldCheck,
                  title: isArabic ? "خطة آمنة" : "Safety-first",
                  text: isArabic ? "تخطيط يناسب الطقس والراحة والرحلة." : "Weather-aware trip planning with comfort in mind."
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
                  src={tour.image}
                  alt={tour.localized.h1}
                  fill
                  className="object-cover"
                  priority
                  withBlur={false}
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  fetchPriority="high"
                  quality={64}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.05)_0%,rgba(2,6,23,0.15)_48%,rgba(2,6,23,0.82)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
                    <Star className="h-3.5 w-3.5 text-emerald-300" />
                    {isArabic ? "رحلة مختارة" : "Signature trip"}
                  </div>
                  <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur">
                    <p className="text-sm leading-6 text-slate-300">{tour.localized.description}</p>
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
                {isArabic ? "خلاصة الرحلة" : "Trip summary"}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {isArabic ? "كل ما تحتاجه قبل الحجز" : "Everything you need before booking"}
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">{tour.localized.answer}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-emerald-700">{isArabic ? "الوصف" : "Overview"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{tour.localized.intro}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-emerald-700">{isArabic ? "الفئة المناسبة" : "Best for"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {isArabic ? "العائلات والمسافرون الباحثون عن راحة وخصوصية." : "Families and travelers who want comfort and privacy."}
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-emerald-700">{isArabic ? "اللغة" : "Language"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{isArabic ? "دعم عربي وإنجليزي." : "Arabic and English support."}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-emerald-700">{isArabic ? "السعر التقديري" : "Approximate rate"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{isArabic ? "من 120 GEL حسب الرحلة والسيارة." : "From 120 GEL depending on route and vehicle."}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-900 shadow-xl shadow-slate-900/5 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              {isArabic ? "أبرز النقاط" : "Key highlights"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {isArabic ? "الأسباب العملية لاختيار هذه الرحلة" : "Why this route is a strong choice"}
            </h2>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-700">
              {tour.localized.highlights.map((point) => (
                <li key={point} className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">{isArabic ? "سؤال شائع" : "Common question"}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">{tour.localized.question}</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">{tour.localized.answer}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/995579088537?text=${encodeURIComponent(whatsappMessage)}`}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                <MessageCircle className="h-4 w-4" />
                {isArabic ? "احجز عبر واتساب" : "Book on WhatsApp"}
              </a>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {isArabic ? "اذهب إلى الحجز" : "Go to booking"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
