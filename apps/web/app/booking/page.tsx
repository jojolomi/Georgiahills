import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { buildPageMetadata } from "../../lib/seo";
import { buildHreflangAlternates } from "../../lib/i18n";
import { StructuredData } from "../../components/StructuredData";

export const metadata: Metadata = buildPageMetadata({
  title: "Book Your Trip | Georgia Hills",
  description:
    "Complete our booking wizard to plan your private Georgia tour with curated routes and driver service.",
  path: "/booking",
  alternates: buildHreflangAlternates("/booking")
});

const BookingWizard = dynamic(() => import("@/components/BookingWizard.client"), {
  ssr: false,
  loading: () => (
    <div className="booking-wizard-shell rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
      Loading booking wizard...
    </div>
  )
});

export default function BookingPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <StructuredData
        type="TravelAgency"
        data={{
          description:
            "Private tours and driver service across Georgia – tailored for families and GCC travelers.",
          areaServed: { "@type": "Country", name: "Georgia" }
        }}
      />
      <h1 className="mb-3 text-3xl font-semibold text-slate-900">Book Your Trip</h1>
      <p className="mb-6 text-slate-600">
        Complete the booking wizard below to send your request.
      </p>

      <div className="mb-4 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        Booking wizard placeholder (server-rendered). The interactive wizard hydrates on client load.
      </div>

      <BookingWizard />
    </main>
  );
}
