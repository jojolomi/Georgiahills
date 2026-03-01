import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OptimizedImage } from "../../../../components/OptimizedImage";
import { StructuredData } from "../../../../components/StructuredData";
import { buildDestinationMetadata } from "../../../../lib/seo";
import { buildHreflangAlternates } from "../../../../lib/i18n";
import destinationContent from "../../../../content/destinations.json";

type DestinationRecord = {
  slug: string;
  title: string;
  description: string;
  heading: string;
  summary: string;
  image: string;
  updatedAt?: string;
};

export function generateStaticParams() {
  return (destinationContent as DestinationRecord[]).map((d) => ({ slug: d.slug }));
}

type DestinationPageProps = {
  params: {
    slug: string;
  };
};

function getDestination(slug: string) {
  return (destinationContent as DestinationRecord[]).find((item) => item.slug === slug);
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const destination = getDestination(params.slug);

  if (!destination) {
    return {
      title: "Destination Not Found"
    };
  }

  return buildDestinationMetadata({
    slug: params.slug,
    title: destination.title,
    description: destination.description,
    alternates: buildHreflangAlternates(`/destinations/${params.slug}`)
  });
}

export default function DestinationPage({ params }: DestinationPageProps) {
  const destination = getDestination(params.slug);

  if (!destination) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <StructuredData
        type="TouristAttraction"
        data={{
          name: destination.heading,
          description: destination.description,
          image: destination.image
            ? `https://georgiahills.com${destination.image}`
            : undefined,
          address: { "@type": "PostalAddress", addressCountry: "GE" }
        }}
      />
      <StructuredData
        type="TouristTrip"
        data={{
          name: destination.heading,
          description: destination.description,
          itinerary: destination.summary,
          touristType: "Families and GCC travelers"
        }}
      />
      <StructuredData
        type="Breadcrumb"
        data={{
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://georgiahills.com/en" },
            { "@type": "ListItem", position: 2, name: "Destinations", item: "https://georgiahills.com/en/destinations" },
            {
              "@type": "ListItem",
              position: 3,
              name: destination.heading,
              item: `https://georgiahills.com/en/destinations/${params.slug}`
            }
          ]
        }}
      />
      <StructuredData
        type="Review"
        data={{
          reviewBody: "Excellent route planning and responsive support for family travel.",
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          author: { "@type": "Person", name: "Verified Traveler" },
          itemReviewed: { "@type": "TouristTrip", name: destination.heading }
        }}
      />

      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{destination.heading}</h1>
        <p className="mt-3 text-slate-600">{destination.summary}</p>
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <OptimizedImage
            src={destination.image}
            alt={destination.heading}
            width={1024}
            height={640}
            className="h-auto w-full"
            priority
            withBlur
            sizes="(max-width: 1024px) 100vw, 1024px"
            fetchPriority="high"
          />
        </div>
      </section>
    </main>
  );
}