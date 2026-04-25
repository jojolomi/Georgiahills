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
const maxTitleLength = 60;
const maxDescriptionLength = 155;

function normalizePath(path: string) {
  if (!path.startsWith("/")) return `/${path}`;
  return path;
}

function absolute(path: string) {
  return `${siteUrl}${normalizePath(path)}`;
}

function clampText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
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
  const title = clampText(input.title, maxTitleLength);
  const description = clampText(input.description, maxDescriptionLength);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: input.alternates
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: "website",
      images
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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