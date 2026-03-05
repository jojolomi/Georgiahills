type StructuredDataKind =
  | "Organization"
  | "TravelAgency"
  | "TouristTrip"
  | "TouristAttraction"
  | "BlogPosting"
  | "FAQ"
  | "Breadcrumb"
  | "Review"
  | "Product"
  | "Service"
  | "Event";

type StructuredDataProps = {
  type: StructuredDataKind;
  data: Record<string, unknown>;
};

type StructuredDataGraphProps = {
  nodes: Array<{
    type: StructuredDataKind;
    data: Record<string, unknown>;
  }>;
};

export function createSchemaNode(type: StructuredDataKind, data: Record<string, unknown>) {
  switch (type) {
    case "Organization":
      return {
        "@type": "Organization",
        name: "Georgia Hills",
        url: "https://georgiahills.com",
        ...data
      };

    case "TravelAgency":
      return {
        "@type": "TravelAgency",
        name: "Georgia Hills",
        url: "https://georgiahills.com",
        ...data
      };

    case "TouristTrip":
      return {
        "@type": "TouristTrip",
        provider: {
          "@type": "Organization",
          name: "Georgia Hills"
        },
        ...data
      };

    case "TouristAttraction":
      return {
        "@type": "TouristAttraction",
        ...data
      };

    case "BlogPosting":
      return {
        "@type": "BlogPosting",
        ...data
      };

    case "FAQ":
      return {
        "@type": "FAQPage",
        ...data
      };

    case "Breadcrumb":
      return {
        "@type": "BreadcrumbList",
        ...data
      };

    case "Review":
      return {
        "@type": "Review",
        ...data
      };

    case "Product":
      return {
        "@type": "Product",
        ...data
      };

    case "Service":
      return {
        "@type": "Service",
        ...data
      };

    case "Event":
      return {
        "@type": "Event",
        ...data
      };

    default:
      return {
        ...data
      };
  }
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const payload = {
    "@context": "https://schema.org",
    ...createSchemaNode(type, data)
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />;
}

export function StructuredDataGraph({ nodes }: StructuredDataGraphProps) {
  const payload = {
    "@context": "https://schema.org",
    "@graph": nodes.map((node) => createSchemaNode(node.type, node.data))
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />;
}