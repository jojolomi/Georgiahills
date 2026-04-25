import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "../../../lib/seo";
import { buildHreflangAlternates, isSupportedLocale, type Locale } from "../../../lib/i18n";

type TermsPageProps = {
  params: { locale: string };
};

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const locale = isSupportedLocale(params.locale) ? (params.locale as Locale) : "en";
  return buildPageMetadata({
    title: locale === "ar" ? "الشروط والأحكام | Georgia Hills" : "Terms & Conditions | Georgia Hills",
    description:
      locale === "ar"
        ? "الشروط والأحكام الخاصة بخدمات السائق الخاص والجولات المقدمة من Georgia Hills."
        : "Terms and conditions for private driver and tour services provided by Georgia Hills.",
    path: `/${locale}/terms`,
    alternates: buildHreflangAlternates("/terms")
  });
}

export default function TermsPage({ params }: TermsPageProps) {
  if (!isSupportedLocale(params.locale)) {
    notFound();
  }

  const isArabic = params.locale === "ar";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">{isArabic ? "الشروط والأحكام" : "Terms & Conditions"}</h1>
      <h2 className="mt-6 text-xl font-semibold text-slate-900">{isArabic ? "تأكيد الخدمة" : "Service Confirmation"}</h2>
      <p className="mt-2 text-slate-700">
        {isArabic
          ? "يتم تأكيد الخدمة بعد توثيق خط السير والمواعيد والسعر النهائي عبر واتساب أو البريد الإلكتروني."
          : "Service is confirmed after route details, dates, and final pricing are agreed in writing via WhatsApp or email."}
      </p>
      <h2 className="mt-6 text-xl font-semibold text-slate-900">{isArabic ? "المسؤولية" : "Liability"}</h2>
      <p className="mt-2 text-slate-700">
        {isArabic
          ? "تلتزم الشركة بتقديم الخدمة وفق الخطة المتفق عليها، مع حق تعديل المسار عند الطقس أو إغلاق الطرق حفاظًا على السلامة."
          : "We deliver services according to the agreed itinerary and may adjust routes due to weather or road closures for safety."}
      </p>
    </main>
  );
}
