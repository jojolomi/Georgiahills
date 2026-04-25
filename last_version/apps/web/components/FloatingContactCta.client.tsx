"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, Zap } from "lucide-react";
import { QuickBookingModal } from "./QuickBookingModal.client";

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
          className="group flex h-12 w-12 sm:h-auto sm:w-auto items-center justify-center sm:px-4 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm hover:bg-emerald-100 transition-colors"
          aria-label={isArabic ? "حجز سريع" : "Quick booking"}
        >
          <Zap className="h-5 w-5 sm:mr-2 sm:rtl:ml-2 sm:rtl:mr-0" />
          <span className="hidden sm:inline font-semibold text-sm">
            {isArabic ? "حجز سريع" : "Quick Book"}
          </span>
        </button>
        <a
          href={`tel:${phoneNumber}`}
          onClick={() => track("call_click", { page_path: pathname, lang: isArabic ? "ar" : "en" })}
          className="group flex h-12 w-12 sm:h-auto sm:w-auto items-center justify-center sm:px-4 rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50 transition-colors"
          aria-label={isArabic ? "اتصال مباشر" : "Call now"}
        >
          <Phone className="h-5 w-5 sm:mr-2 sm:rtl:ml-2 sm:rtl:mr-0" />
          <span className="hidden sm:inline font-semibold text-sm">
            {isArabic ? "اتصال" : "Call"}
          </span>
        </a>
        <a
          href={whatsappHref}
          onClick={() => track("whatsapp_click", { page_path: pathname, lang: isArabic ? "ar" : "en" })}
          className="group flex h-12 w-12 sm:h-auto sm:w-auto items-center justify-center sm:px-4 rounded-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 transition-colors"
          aria-label={isArabic ? "تواصل عبر واتساب" : "Contact on WhatsApp"}
        >
          <MessageCircle className="h-5 w-5 sm:mr-2 sm:rtl:ml-2 sm:rtl:mr-0" />
          <span className="hidden sm:inline font-semibold text-sm">
            WhatsApp
          </span>
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
