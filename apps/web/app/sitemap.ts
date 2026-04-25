import type { MetadataRoute } from "next";
import { getContentSlugs } from "../lib/content";
import { getFleetSlugs } from "../lib/fleet";
import { getTourSlugs } from "../lib/tours";
import destinationsData from "../content/destinations.json";

type ExtendedSitemapEntry = MetadataRoute.Sitemap[number] & {
  images?: string[];
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://georgiahills.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const enBlogSlugs = await getContentSlugs("blog", "en");
  const arBlogSlugs = await getContentSlugs("blog", "ar");
  const tourSlugs = getTourSlugs();
  const fleetSlugs = getFleetSlugs();
  const destinationSlugs = (destinationsData as Array<{ slug: string }>).map((destination) => destination.slug);

  const staticEntries: ExtendedSitemapEntry[] = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      images: [`${siteUrl}/image-1600.avif`]
    },
    {
      url: `${siteUrl}/en`,
      lastModified: now,
      images: [`${siteUrl}/image-1600.avif`]
    },
    {
      url: `${siteUrl}/ar`,
      lastModified: now,
      images: [`${siteUrl}/image-1600.avif`]
    },
    {
      url: `${siteUrl}/booking`,
      lastModified: now,
      images: [`${siteUrl}/image-1600.avif`]
    }
  ];

  const tourEntries: ExtendedSitemapEntry[] = tourSlugs.flatMap((slug) => [
    {
      url: `${siteUrl}/en/tours/${slug}`,
      lastModified: now,
      images: [`${siteUrl}/image-1024.avif`]
    },
    {
      url: `${siteUrl}/ar/tours/${slug}`,
      lastModified: now,
      images: [`${siteUrl}/image-1024.avif`]
    }
  ]);

  const fleetEntries: ExtendedSitemapEntry[] = [
    {
      url: `${siteUrl}/en/fleet`,
      lastModified: now,
      images: [`${siteUrl}/image-1024.avif`]
    },
    {
      url: `${siteUrl}/ar/fleet`,
      lastModified: now,
      images: [`${siteUrl}/image-1024.avif`]
    },
    ...fleetSlugs.flatMap((slug) => [
      {
        url: `${siteUrl}/en/fleet/${slug}`,
        lastModified: now,
        images: [`${siteUrl}/image-1024.avif`]
      },
      {
        url: `${siteUrl}/ar/fleet/${slug}`,
        lastModified: now,
        images: [`${siteUrl}/image-1024.avif`]
      }
    ])
  ];

  const blogEntries: ExtendedSitemapEntry[] = [
    ...enBlogSlugs.map((slug) => ({
      url: `${siteUrl}/en/blog/${slug}`,
      lastModified: now,
      images: [`${siteUrl}/image-1024.avif`]
    })),
    ...arBlogSlugs.map((slug) => ({
      url: `${siteUrl}/ar/blog/${slug}`,
      lastModified: now,
      images: [`${siteUrl}/image-1024.avif`]
    }))
  ];

  const destinationEntries: ExtendedSitemapEntry[] = destinationSlugs.map((slug) => ({
    url: `${siteUrl}/en/destinations/${slug}`,
    lastModified: now,
    images: [`${siteUrl}/image-1024.avif`]
  }));

  return [...staticEntries, ...tourEntries, ...fleetEntries, ...blogEntries, ...destinationEntries] as MetadataRoute.Sitemap;
}