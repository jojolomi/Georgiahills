"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { QuickBookingModal } from "./QuickBookingModal.client";
import { useState } from "react";

const phoneNumber = "+995579088537";
const whatsappNumber = "995579088537";

function buildMessage(pathname: string, isArabic: boolean) {
  if (pathname.includes("/fleet/")) {
    return isArabic
      ? "مرحبًا، أريد تفاصيل خدمة السيارة والسائق الخاص."
      : "Hello, I want details about your fleet and private driver service.";
  }

  if (pathname.includes("/tours/")) {
    return isArabic
      ? "مرحبًا، أريد تفاصيل الجولة مع سائق خاص في جورجيا."
      : "Hello, I want details for this tour with a private driver in Georgia.";
  }

  return isArabic
    ? "مرحبًا، أريد عرض سعر لرحلة خاصة في جورجيا."
    : "Hello, I want a quote for a private Georgia trip.";
}

export function FloatingContactCta() {
  const pathname = usePathname() || "/";
  const isArabic = pathname.startsWith("/ar");
  const [showModal, setShowModal] = useState(false);

  const track = (eventName: string, params: Record<string, string>) => {
    if (typeof window === "undefined") return;
    const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
    if (gtag) {
      gtag("event", eventName, params);
    }
  };

  const whatsappHref = useMemo(() => {
    const message = buildMessage(pathname, isArabic);
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [pathname, isArabic]);

  return (
    <>
      <div className="fixed bottom-5 end-4 z-50 flex items-center gap-2 sm:bottom-6 sm:end-6">
        <button
          type="button"
          onClick={() => {
            setShowModal(true);
            track("booking_modal_open", { page_path: pathname, lang: isArabic ? "ar" : "en" });
          }}
          className="inline-flex h-11 items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 shadow-sm"
          aria-label={isArabic ? "حجز سريع" : "Quick booking"}
        >
          {isArabic ? "حجز سريع" : "Quick Book"}
        </button>
      <a
        href={`tel:${phoneNumber}`}
        onClick={() => track("call_click", { page_path: pathname, lang: isArabic ? "ar" : "en" })}
        className="inline-flex h-11 items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm"
        aria-label={isArabic ? "اتصال مباشر" : "Call now"}
      >
        {isArabic ? "اتصال" : "Call"}
      </a>
      <a
        href={whatsappHref}
        onClick={() => track("whatsapp_click", { page_path: pathname, lang: isArabic ? "ar" : "en" })}
        className="inline-flex h-11 items-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm"
        aria-label={isArabic ? "تواصل عبر واتساب" : "Contact on WhatsApp"}
      >
        WhatsApp
      </a>
      </div>
      {showModal ? (
        <QuickBookingModal
          isArabic={isArabic}
          onClose={() => setShowModal(false)}
          onSubmitted={() => track("booking_modal_whatsapp_submit", { page_path: pathname, lang: isArabic ? "ar" : "en" })}
        />
      ) : null}
    </>
  );
}
