import type { MetadataRoute } from "next";
import fs from "node:fs/promises";
import path from "node:path";

type DestinationRecord = {
  slug: string;
  image?: string;
  updatedAt?: string;
};

type ExtendedSitemapEntry = MetadataRoute.Sitemap[number] & {
  images?: string[];
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://georgiahills.com";

async function readDestinationContent(): Promise<DestinationRecord[]> {
  const filePath = path.join(process.cwd(), "content", "destinations.json");

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as DestinationRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const destinations = await readDestinationContent();

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
    }
  ];

  const destinationEntries: ExtendedSitemapEntry[] = destinations.map((item) => ({
    url: `${siteUrl}/en/destinations/${item.slug}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
    images: [item.image ? `${siteUrl}${item.image}` : `${siteUrl}/image-1600.avif`]
  }));

  return [...staticEntries, ...destinationEntries] as MetadataRoute.Sitemap;
}