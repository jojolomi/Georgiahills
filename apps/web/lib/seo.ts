import type { Metadata } from "next";

type AlternateLanguages = Record<string, string>;

type BuildPageMetadataInput = {
  title: string;
  description: string;
  path: string;
  alternates?: AlternateLanguages;
  images?: string[];
};

const siteName = "Georgia Hills";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://georgiahills.com";

function normalizePath(path: string) {
  if (!path.startsWith("/")) return `/${path}`;
  return path;
}

function absolute(path: string) {
  return `${siteUrl}${normalizePath(path)}`;
}

export function buildOpenGraphImages(input?: string[]) {
  if (input?.length) {
    return input.map((image) => (image.startsWith("http") ? image : absolute(image)));
  }

  return [absolute("/image-1600.avif")];
}

export function buildPageMetadata(input: BuildPageMetadataInput): Metadata {
  const canonical = absolute(input.path);
  const images = buildOpenGraphImages(input.images);

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
      languages: input.alternates
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName,
      type: "website",
      images
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images
    }
  };
}

export function buildDestinationMetadata(input: {
  slug: string;
  title: string;
  description: string;
  alternates: AlternateLanguages;
}) {
  return buildPageMetadata({
    title: input.title,
    description: input.description,
    path: `/en/destinations/${input.slug}`,
    alternates: input.alternates
  });
}