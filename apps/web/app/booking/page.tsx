import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, MessageCircle, ShieldCheck, Sparkles, Users } from "lucide-react";
import { OptimizedImage } from "../../components/OptimizedImage";
import { StructuredDataGraph } from "../../components/StructuredData";
import { buildHreflangAlternates } from "../../lib/i18n";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Book Your Trip | Georgia Hills",
  description:
    "Complete our booking wizard to plan your private Georgia trip with curated routes, vehicle options, and driver service.",
  path: "/booking",
  alternates: buildHreflangAlternates("/booking", {
    englishPath: "/booking",
    xDefaultPath: "/booking",
    includeArabic: false
  }),
  images: ["/hero-home-1600.avif"]
});

const BookingWizard = dynamic(() => import("@/components/BookingWizard.client"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
      Loading booking wizard...
    </div>
  )
});

export default function BookingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.2),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_42%,_#f8fafc_42%,_#f8fafc_100%)]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <StructuredDataGraph
          nodes={[
            {
              type: "Organization",
              data: {
                sameAs: ["https://www.instagram.com/georgiahills", "https://www.facebook.com/georgiahills"],
                contactPoint: [
                  {
                    "@type": "ContactPoint",
                    telephone: "+995579088537",
                    contactType: "customer service",
                    availableLanguage: ["en", "ar"],
                    areaServed: "GE"
                  }
                ]
              }
            },
            {
              type: "Service",
              data: {
                name: "Private Georgia Trip Booking",
                description:
                  "Private tours and driver service across Georgia, tailored for families and GCC travelers.",
                areaServed: { "@type": "Country", name: "Georgia" },
                provider: {
                  "@type": "Organization",
                  name: "Georgia Hills"
                }
              }
            },
            {
              type: "Breadcrumb",
              data: {
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "https://georgiahills.com/" },
                  { "@type": "ListItem", position: 2, name: "Booking", item: "https://georgiahills.com/booking" }
                ]
              }
            }
          ]}
        />

        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
              <Sparkles className="h-3.5 w-3.5" />
              Booking
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Book the route, vehicle, and trip details in one flow
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Use the wizard below for a structured request, or jump to WhatsApp if you want a faster back-and-forth.
              The form captures the route, guest count, date, and notes without extra friction.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="https://wa.me/995579088537?text=Hello%2C%20I%20want%20a%20private%20Georgia%20trip%20plan"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp booking
              </a>
              <Link
                href="/en/fleet"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore fleet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: "Clear traveler details",
                  text: "Capture full name, email, phone, and guest count first."
                },
                {
                  icon: Clock3,
                  title: "Trip context next",
                  text: "Add the destination, date, and route size in a clean second step."
                },
                {
                  icon: ShieldCheck,
                  title: "Simple follow-up",
                  text: "Share notes and submit, then continue the conversation on WhatsApp."
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
              <div className="aspect-[16/10] overflow-hidden">
                <div className="relative h-full w-full">
                  <OptimizedImage
                    src="/hero-home-1600.avif"
                    alt="Georgia Hills booking hero"
                    fill
                    className="object-cover"
                    priority
                    withBlur={false}
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    fetchPriority="high"
                    quality={64}
                  />
                </div>
              </div>
              <div className="space-y-4 p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/90">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                  What the wizard collects
                </div>
                <ul className="space-y-3 text-sm leading-6 text-slate-300">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    Traveler contact info and preferred communication method.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    Destination, travel date, guest count, and special notes.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    A structured request that can be followed up quickly by the team.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-900 shadow-xl shadow-slate-900/5 sm:p-8">
          <div className="mb-6 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Book now</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Send a complete request with the booking wizard</h2>
            <p className="mt-3 text-base leading-8 text-slate-600">
              The form keeps the interaction lightweight while still giving enough detail for a proper quote. If you prefer, use WhatsApp instead of waiting for the form.
            </p>
          </div>

          <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Booking wizard placeholder. The interactive wizard hydrates on client load.
          </div>

          <BookingWizard />
        </section>
      </div>
    </main>
  );
}
