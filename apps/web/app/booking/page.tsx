import dynamic from "next/dynamic";

const BookingWizard = dynamic(() => import("@/components/BookingWizard.client"), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
      Loading booking wizard...
    </div>
  )
});

export default function BookingPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
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
