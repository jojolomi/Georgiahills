type StructuredDataKind = "Organization" | "TravelAgency" | "TouristTrip" | "FAQ" | "Breadcrumb" | "Review";

type StructuredDataProps = {
  type: StructuredDataKind;
  data: Record<string, unknown>;
};

function buildPayload(type: StructuredDataKind, data: Record<string, unknown>) {
  switch (type) {
    case "Organization":
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Georgia Hills",
        url: "https://georgiahills.com",
        ...data
      };

    case "TravelAgency":
      return {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        name: "Georgia Hills",
        url: "https://georgiahills.com",
        ...data
      };

    case "TouristTrip":
      return {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        provider: {
          "@type": "Organization",
          name: "Georgia Hills"
        },
        ...data
      };

    case "FAQ":
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        ...data
      };

    case "Breadcrumb":
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        ...data
      };

    case "Review":
      return {
        "@context": "https://schema.org",
        "@type": "Review",
        ...data
      };

    default:
      return {
        "@context": "https://schema.org",
        ...data
      };
  }
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const payload = buildPayload(type, data);

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />;
}