import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Globe2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users
} from "lucide-react";
import fleetData from "../../../content/fleet.json";
import toursData from "../../../content/tours.json";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { StructuredDataGraph } from "../../../components/StructuredData";
import type { FleetRecord } from "../../../lib/fleet";
import type { TourRecord } from "../../../lib/tours";
import { buildHreflangAlternates, getMessages, isSupportedLocale, locales, type Locale } from "../../../lib/i18n";
import { buildPageMetadata } from "../../../lib/seo";

type LocalizedPageProps = {
  params: {
    locale: string;
  };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://georgiahills.com";

function buildWhatsappLink(message: string) {
  return `https://wa.me/995579088537?text=${encodeURIComponent(message)}`;
}

function buildRouteHref(locale: Locale, slug: string) {
  return `/${locale}/tours/${slug}`;
}

function buildFleetHref(locale: Locale, slug: string) {
  return `/${locale}/fleet/${slug}`;
}

function formatApproxPrice(locale: Locale, baseGel: number, rates: { SAR: number; AED: number }, asOf: string) {
  const currency = locale === "ar" ? "SAR" : "AED";
  const approx = Math.round(baseGel * rates[currency]);
  if (locale === "ar") {
    return `السعر الأساسي ${baseGel} GEL (حوالي ${approx} ${currency}) - سعر تقريبي بناءً على تحويل ${asOf}.`;
  }
  return `Base price ${baseGel} GEL (about ${approx} ${currency}) - approximate conversion as of ${asOf}.`;
}

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
    alternates: buildHreflangAlternates(""),
    images: ["/hero-home-1600.avif"]
  });
}

export default function LocalizedMarketingPage({ params }: LocalizedPageProps) {
  if (!isSupportedLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const messages = getMessages(locale);
  const isArabic = locale === "ar";
  const baseTourPriceGel = 120;
  const conversionAsOf = "2026-03-03";
  const conversionRates = { SAR: 1.38, AED: 1.35 };
  const tours = toursData as TourRecord[];
  const fleet = fleetData as FleetRecord[];
  const featuredTours = tours.slice(0, 3);
  const featuredFleet = fleet.slice(0, 3);
  const approxPriceNote = formatApproxPrice(locale, baseTourPriceGel, conversionRates, conversionAsOf);

  const routeHighlights = [
    {
      icon: MapPin,
      title: isArabic ? "وجهات واضحة" : "Clear destination focus",
      description: isArabic
        ? "تبليسي وكازبيجي وباتومي وغيرها تظهر في بنية صفحات سهلة التصفح."
        : "Tbilisi, Kazbegi, Batumi, and more appear in an easy-to-scan page structure."
    },
    {
      icon: ShieldCheck,
      title: isArabic ? "ثقة وسياسات" : "Trust and policy clarity",
      description: isArabic
        ? "صفحات الخصوصية والشروط والاسترداد تبقى ظاهرة ومترابطة."
        : "Privacy, terms, and refund pages stay visible and connected."
    },
    {
      icon: Clock3,
      title: isArabic ? "مسار حجز سريع" : "Shorter booking path",
      description: isArabic
        ? "من الصفحة الرئيسية إلى واتساب أو نموذج الحجز بدون خطوات زائدة."
        : "From the homepage to WhatsApp or booking with no extra friction."
    }
  ];

  const bookingSteps = [
    {
      step: "01",
      title: isArabic ? "اختر الرحلة" : "Choose the route",
      description: isArabic
        ? "ابدأ بجولات المدينة أو الجبال أو الساحل حسب أسلوب السفر."
        : "Start with city, mountain, or coastal routes based on travel style."
    },
    {
      step: "02",
      title: isArabic ? "حدد السيارة" : "Pick the vehicle",
      description: isArabic
        ? "اختر سيدان أو ميني فان VIP أو فئة فاخرة بحسب عدد المسافرين."
        : "Choose sedan, VIP minivan, or luxury class by group size."
    },
    {
      step: "03",
      title: isArabic ? "أكمل الحجز" : "Confirm booking",
      description: isArabic
        ? "أرسل التفاصيل عبر واتساب أو صفحة الحجز وسنرد بخطة واضحة."
        : "Send the details via WhatsApp or booking form and get a clear plan back."
    }
  ];

  const faqItems = [
    {
      question: isArabic ? "هل تتوفر خدمة باللغة العربية؟" : "Do you support Arabic-speaking travelers?",
      answer: isArabic
        ? "نعم، الصفحة والمحتوى يدعمان العربية والإنجليزية، ويمكننا تنسيق الرحلة بطريقة مناسبة للعائلات الخليجية."
        : "Yes. The site supports English and Arabic, and trip planning is tailored for GCC family travel."
    },
    {
      question: isArabic ? "كيف أبدأ الحجز؟" : "How do I start booking?",
      answer: isArabic
        ? "اختر الرحلة أو السيارة ثم استخدم زر الحجز أو واتساب لإرسال التواريخ وعدد المسافرين."
        : "Pick a route or vehicle, then use the booking or WhatsApp button to share dates and traveler count."
    }
  ];

  const bookingMessage = isArabic
    ? "مرحبًا، أريد خطة رحلة خاصة في جورجيا مع سائق وسيارة مناسبة لعائلتي."
    : "Hello, I want a private Georgia trip plan with a driver and the right vehicle for my group.";

  const whatsappHref = buildWhatsappLink(bookingMessage);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.24),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_46%,_#f8fafc_46%,_#f8fafc_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[linear-gradient(180deg,rgba(15,23,42,0.96)_0%,rgba(15,23,42,0.88)_44%,rgba(15,23,42,0)_100%)]" />

      <StructuredDataGraph
        nodes={[
          {
            type: "Organization",
            data: {
              url: siteUrl,
              sameAs: ["https://www.instagram.com/georgiahills", "https://www.facebook.com/georgiahills"],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+995579088537",
                  contactType: "customer service",
                  areaServed: "GE",
                  availableLanguage: ["en", "ar"]
                }
              ]
            }
          },
          {
            type: "Service",
            data: {
              name: isArabic ? "خدمة السائق الخاص في جورجيا" : "Private Driver Service in Georgia",
              description: messages.description,
              areaServed: { "@type": "Country", name: "Georgia" },
              provider: {
                "@type": "Organization",
                name: "Georgia Hills"
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: isArabic ? "فئات السيارات" : "Fleet options",
                itemListElement: featuredFleet.map((vehicle) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: isArabic ? vehicle.ar.h1 : vehicle.en.h1
                  },
                  price: `${vehicle.priceGel}`,
                  priceCurrency: "GEL"
                }))
              }
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
                }
              ]
            }
          },
          {
            type: "FAQ",
            data: {
              inLanguage: locale,
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer
                }
              }))
            }
          }
        ]}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <section className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
              <Sparkles className="h-3.5 w-3.5" />
              {messages.badge}
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {messages.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {messages.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                {messages.button}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/fleet`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {isArabic ? "استعرض الأسطول" : "View fleet"}
              </Link>
              <a
                href={whatsappHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-200">
              {[
                isArabic ? "دعم عربي وإنجليزي" : "Arabic and English support",
                isArabic ? "تخطيط مناسب للعائلات" : "Family-first trip planning",
                isArabic ? "سياسات واضحة" : "Clear policy pages"
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {routeHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-base font-semibold text-white">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-emerald-500/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl shadow-emerald-950/20">
              <div className="relative aspect-[4/5] sm:aspect-[16/14]">
                <OptimizedImage
                  src="/hero-home-1600.avif"
                  alt={messages.imageAlt}
                  fill
                  className="object-cover"
                  priority
                  withBlur={false}
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  fetchPriority="high"
                  quality={65}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.05)_0%,rgba(2,6,23,0.14)_50%,rgba(2,6,23,0.82)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                    {isArabic ? "رحلات خاصة ومضبوطة" : "Private travel, built well"}
                  </div>
                  <div className="mt-4 grid gap-3 rounded-3xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur md:grid-cols-[1.3fr_0.7fr] md:items-end">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {isArabic ? "الوجهة المميزة" : "Featured destination"}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">Tbilisi</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {isArabic
                          ? "مدينة البداية المثالية للرحلات العائلية، مع مسارات واضحة وأوقات مرنة وراحة أعلى."
                          : "The ideal starting point for family trips, with clear routes, flexible timing, and more comfort."}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-50">
                      <div className="flex items-center gap-2 text-emerald-200">
                        <Star className="h-4 w-4 fill-current" />
                        {isArabic ? "مركز الرحلة" : "Trip hub"}
                      </div>
                      <p className="mt-2 leading-6 text-slate-100">
                        {isArabic
                          ? "ابدأ من تبليسي ثم انتقل إلى كازبيجي أو باتومي أو كاخيتي بسهولة."
                          : "Start in Tbilisi, then move to Kazbegi, Batumi, or Kakheti with ease."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Globe2 className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">{isArabic ? "لغتان" : "2 languages"}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {isArabic ? "تجربة عربية وإنجليزية متسقة من أول صفحة." : "Consistent English and Arabic experience from the first screen."}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">{isArabic ? "خيار العائلة" : "Family-ready"}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {isArabic ? "مسارات مريحة ومناسبة للعائلات والرحلات الخاصة." : "Comfort-focused routes for families and private trips."}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700">
                  <BadgeCheck className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">{isArabic ? "سياسات" : "Policies"}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {isArabic ? "خصوصية وشروط واسترداد مرئية وسهلة الوصول." : "Privacy, terms, and refund pages stay visible and easy to reach."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-900 shadow-xl shadow-slate-900/5 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                {isArabic ? "لماذا هذه النسخة أفضل" : "Why this version is stronger"}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {isArabic ? "ترتيب أوضح، حجز أسرع، وإشارات ثقة أقوى" : "Clearer structure, faster booking, stronger trust signals"}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
                {isArabic
                  ? "نأخذ أفضل ما في الأرشيف: وضوح العروض، مسار تحويل مباشر، وصفحات سياسة ظاهرة، ثم نعيد تقديمه داخل البنية الحالية الأكثر قابلية للصيانة والقياس."
                  : "We keep the best archive traits: clearer offers, a direct conversion path, visible policy pages, and rebuild them inside the current maintainable, measurable stack."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: isArabic ? "التحويل" : "Conversion",
                  description: isArabic
                    ? "أزرار حجز وواتساب وأسطول في أعلى الصفحة."
                    : "Booking, WhatsApp, and fleet CTAs stay above the fold."
                },
                {
                  title: isArabic ? "الأداء" : "Performance",
                  description: isArabic
                    ? "صفحة خفيفة، صور مضبوطة، ومحتوى ثابت على الخادم."
                    : "Light page shell, tuned images, and mostly server-rendered content."
                },
                {
                  title: isArabic ? "الـSEO" : "SEO",
                  description: isArabic
                    ? "مخطط بيانات، hreflang، وروابط صفحات واضحة."
                    : "Structured data, hreflang, and explicit route links."
                }
              ].map((item) => (
                <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-emerald-700">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">{messages.featuredLabel}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {isArabic ? "أفضل المسارات للعملاء الخليجيين" : "Featured routes for GCC travelers"}
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                {isArabic
                  ? "صفحات الرحلات تعطي الزائر صورة واضحة عن الوجهة، الإيقاع، والراحة قبل بدء الحجز."
                  : "The route pages make the destination, pacing, and comfort level clear before booking begins."}
              </p>
            </div>
            <Link
              href={`/${locale}/fleet`}
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {isArabic ? "عرض الأسطول الكامل" : "See full fleet"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {featuredTours.map((tour, index) => {
              const copy = isArabic ? tour.ar : tour.en;
              return (
                <article key={tour.slug} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900 shadow-xl shadow-slate-950/20">
                  <div className="relative aspect-[16/10]">
                    <OptimizedImage
                      src={tour.image}
                      alt={copy.h1}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      withBlur={false}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      quality={58}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.02)_0%,rgba(2,6,23,0.12)_60%,rgba(2,6,23,0.72)_100%)]" />
                    <div className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                      {index === 0 ? (isArabic ? "الأكثر طلبًا" : "Most requested") : isArabic ? "رحلة مميزة" : "Signature route"}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm font-semibold text-emerald-300">{copy.title}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{copy.h1}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{copy.intro}</p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-200">
                      {copy.highlights.slice(0, 2).map((point) => (
                        <li key={point} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={buildRouteHref(locale, tour.slug)}
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      {isArabic ? "عرض تفاصيل الرحلة" : "View route details"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-900 shadow-xl shadow-slate-900/5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                {isArabic ? "الأسطول" : "Fleet"}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {isArabic ? "اختر السيارة المناسبة قبل بدء الرحلة" : "Pick the right vehicle before the trip starts"}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              {isArabic
                ? "بنية الصفحة تعرض مستوى الراحة والسعة والتسعير بشكل مباشر حتى يختار الزائر بسرعة."
                : "The page structure shows comfort, capacity, and pricing up front so visitors can decide faster."}
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {featuredFleet.map((vehicle) => {
              const copy = isArabic ? vehicle.ar : vehicle.en;
              return (
                <article key={vehicle.slug} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
                  <div className="relative aspect-[16/10]">
                    <OptimizedImage
                      src={vehicle.image}
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
                      {isArabic ? `ابتداءً من ${vehicle.priceGel} GEL` : `From ${vehicle.priceGel} GEL`}
                    </div>
                    <Link
                      href={buildFleetHref(locale, vehicle.slug)}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      {isArabic ? "عرض السيارة" : "View vehicle"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {isArabic ? "تسعير تقريبي للمقارنة" : "Approximate price comparison"}
            </p>
            <p className="mt-2 text-sm text-slate-500">{approxPriceNote}</p>
          </div>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-900 shadow-xl shadow-slate-900/5 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              {isArabic ? "طريقة الحجز" : "Booking flow"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {isArabic ? "ثلاث خطوات فقط للوصول إلى الخطة المناسبة" : "Three steps to the right trip plan"}
            </h2>
            <div className="mt-8 space-y-4">
              {bookingSteps.map((item) => (
                <article key={item.step} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
              {isArabic ? "أسئلة سريعة" : "Quick answers"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {isArabic ? "كل ما يحتاجه الزائر قبل الإرسال" : "Everything a visitor needs before sending a request"}
            </h2>

            <div className="mt-6 space-y-3">
              {faqItems.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-white/10 bg-white/5 p-4">
                  <summary className="cursor-pointer list-none text-base font-semibold text-white">
                    <span className="flex items-center justify-between gap-3">
                      {item.question}
                      <ArrowRight className="h-4 w-4 shrink-0 rotate-90 transition group-open:-rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.answer}</p>
                </details>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                {isArabic ? "اذهب إلى الحجز" : "Go to booking"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
              <div className="flex items-center gap-2 text-emerald-300">
                <MapPin className="h-4 w-4" />
                <span className="font-semibold uppercase tracking-[0.18em]">
                  {isArabic ? "الصفحات المساندة" : "Support pages"}
                </span>
              </div>
              <p className="mt-3">
                {isArabic
                  ? "روابط الخصوصية والشروط والاسترداد تبقى متاحة في التذييل لتقوية الثقة قبل الطلب."
                  : "Privacy, terms, and refund links remain in the footer to reinforce trust before submission."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
