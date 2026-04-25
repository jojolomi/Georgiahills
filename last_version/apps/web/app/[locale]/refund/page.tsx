import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "../../../lib/seo";
import { buildHreflangAlternates, isSupportedLocale, type Locale } from "../../../lib/i18n";

type RefundPageProps = {
  params: { locale: string };
};

export async function generateMetadata({ params }: RefundPageProps): Promise<Metadata> {
  const locale = isSupportedLocale(params.locale) ? (params.locale as Locale) : "en";
  return buildPageMetadata({
    title: locale === "ar" ? "سياسة الاسترداد | Georgia Hills" : "Refund Policy | Georgia Hills",
    description:
      locale === "ar"
        ? "سياسة الاسترداد والإلغاء لحجوزات الجولات وخدمات السائق الخاص لدى Georgia Hills."
        : "Refund and cancellation policy for Georgia Hills tour and private driver bookings.",
    path: `/${locale}/refund`,
    alternates: buildHreflangAlternates("/refund")
  });
}

export default function RefundPage({ params }: RefundPageProps) {
  if (!isSupportedLocale(params.locale)) {
    notFound();
  }

  const isArabic = params.locale === "ar";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">{isArabic ? "سياسة الاسترداد" : "Refund Policy"}</h1>
      <h2 className="mt-6 text-xl font-semibold text-slate-900">{isArabic ? "الإلغاء قبل موعد الخدمة" : "Cancellation Before Service"}</h2>
      <p className="mt-2 text-slate-700">
        {isArabic
          ? "يمكن طلب الإلغاء قبل 72 ساعة أو أكثر من موعد الخدمة لاسترداد كامل، مع خصم رسوم التحويل البنكي إن وجدت."
          : "Cancellations requested 72 hours or more before service are eligible for full refund, excluding any bank transfer charges."}
      </p>
      <h2 className="mt-6 text-xl font-semibold text-slate-900">{isArabic ? "الإلغاء المتأخر" : "Late Cancellation"}</h2>
      <p className="mt-2 text-slate-700">
        {isArabic
          ? "عند الإلغاء خلال أقل من 72 ساعة قد يتم تطبيق رسوم جزئية حسب التزامات التشغيل والحجوزات المؤكدة."
          : "For cancellations within 72 hours, partial charges may apply based on operational commitments and confirmed reservations."}
      </p>
    </main>
  );
}
