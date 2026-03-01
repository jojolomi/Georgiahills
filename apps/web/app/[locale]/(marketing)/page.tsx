import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { Destination } from "@gh/types";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { StructuredData } from "../../../components/StructuredData";
import { buildPageMetadata } from "../../../lib/seo";
import {
  buildHreflangAlternates,
  getMessages,
  isSupportedLocale,
  resolveLocale,
  type Locale
} from "../../../lib/i18n";

type LocalizedPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
  const requestHeaders = headers();
  const locale = resolveLocale(params.locale, requestHeaders.get("accept-language"));
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

  const featuredDestination: Destination = {
    id: "tbilisi",
    slug: "tbilisi",
    name: "Tbilisi",
    country: "Georgia",
    shortDescription: "Historic old town and modern city energy.",
    featured: true
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <StructuredData
        type="Organization"
        data={{
          sameAs: ["https://www.instagram.com", "https://www.tiktok.com"],
          contactPoint: [{ "@type": "ContactPoint", telephone: "+995579088537", contactType: "customer service" }]
        }}
      />
      <StructuredData
        type="FAQ"
        data={{
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
        }}
      />
      <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          <Sparkles className="h-4 w-4" />
          {messages.badge}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{messages.title}</h1>
        <p className="mt-2 text-slate-600">{messages.description}</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <OptimizedImage
            src="/image-640.avif"
            alt={messages.imageAlt}
            width={640}
            height={360}
            className="h-auto w-full"
            priority
            withBlur
            sizes="(max-width: 768px) 100vw, 640px"
            fetchPriority="high"
          />
        </div>
        <p className="mt-2 text-sm text-slate-500">
          {messages.featuredLabel}: {featuredDestination.name}
        </p>
        <button className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
          {messages.button}
        </button>
      </section>
    </main>
  );
}