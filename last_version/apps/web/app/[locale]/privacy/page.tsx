import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "../../../lib/seo";
import { buildHreflangAlternates, isSupportedLocale, type Locale } from "../../../lib/i18n";

type PrivacyPageProps = {
  params: { locale: string };
};

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const locale = isSupportedLocale(params.locale) ? (params.locale as Locale) : "en";
  return buildPageMetadata({
    title: locale === "ar" ? "سياسة الخصوصية | Georgia Hills" : "Privacy Policy | Georgia Hills",
    description:
      locale === "ar"
        ? "سياسة الخصوصية الخاصة بجورجيا هيلز لبيانات الحجز والتواصل عبر واتساب والنماذج الإلكترونية."
        : "Georgia Hills privacy policy covering booking data, WhatsApp communication, and form submissions.",
    path: `/${locale}/privacy`,
    alternates: buildHreflangAlternates("/privacy")
  });
}

export default function PrivacyPage({ params }: PrivacyPageProps) {
  if (!isSupportedLocale(params.locale)) {
    notFound();
  }

  const isArabic = params.locale === "ar";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">{isArabic ? "سياسة الخصوصية" : "Privacy Policy"}</h1>
      <h2 className="mt-6 text-xl font-semibold text-slate-900">{isArabic ? "البيانات التي نجمعها" : "Data We Collect"}</h2>
      <p className="mt-2 text-slate-700">
        {isArabic
          ? "نجمع بيانات الحجز الأساسية مثل الاسم ورقم التواصل والتواريخ وعدد المسافرين لتقديم الخدمة والرد على الطلبات."
          : "We collect essential booking details such as name, contact number, dates, and traveler count to deliver services and respond to requests."}
      </p>
      <h2 className="mt-6 text-xl font-semibold text-slate-900">{isArabic ? "استخدام البيانات" : "How Data Is Used"}</h2>
      <p className="mt-2 text-slate-700">
        {isArabic
          ? "تُستخدم البيانات لتأكيد الحجوزات، تحسين الجودة، وخدمة العملاء، ولا يتم بيع البيانات لأطراف خارجية."
          : "Data is used for booking confirmation, service quality improvement, and customer support. We do not sell customer data to third parties."}
      </p>
    </main>
  );
}
