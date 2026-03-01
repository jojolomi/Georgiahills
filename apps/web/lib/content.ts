import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type ContentLocale = "en" | "ar";
export type ContentCollection = "blog" | "destinations";

export type ContentFrontmatter = {
  title: string;
  slug: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  date?: string;
  locale: ContentLocale;
  image?: string;
};

export type ContentEntry = {
  frontmatter: ContentFrontmatter;
  content: string;
  filePath: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

function getCollectionDir(collection: ContentCollection, locale: ContentLocale) {
  return path.join(CONTENT_ROOT, collection, locale);
}

function normalizeFrontmatter(data: Record<string, unknown>, fallbackSlug: string, locale: ContentLocale): ContentFrontmatter {
  return {
    title: String(data.title || fallbackSlug),
    slug: String(data.slug || fallbackSlug),
    description: String(data.description || ""),
    metaTitle: data.metaTitle ? String(data.metaTitle) : undefined,
    metaDescription: data.metaDescription ? String(data.metaDescription) : undefined,
    date: data.date ? String(data.date) : undefined,
    locale,
    image: data.image ? String(data.image) : undefined
  };
}

export async function getContentSlugs(collection: ContentCollection, locale: ContentLocale): Promise<string[]> {
  const dir = getCollectionDir(collection, locale);

  try {
    const files = await fs.readdir(dir);
    return files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

export async function getContentBySlug(collection: ContentCollection, locale: ContentLocale, slug: string): Promise<ContentEntry | null> {
  const filePath = path.join(getCollectionDir(collection, locale), `${slug}.mdx`);

  try {
    const source = await fs.readFile(filePath, "utf8");
    const parsed = matter(source);
    return {
      frontmatter: normalizeFrontmatter(parsed.data as Record<string, unknown>, slug, locale),
      content: parsed.content,
      filePath
    };
  } catch {
    return null;
  }
}

export async function getAllContent(collection: ContentCollection, locale: ContentLocale): Promise<ContentEntry[]> {
  const slugs = await getContentSlugs(collection, locale);
  const entries = await Promise.all(slugs.map((slug) => getContentBySlug(collection, locale, slug)));
  return entries.filter((item): item is ContentEntry => item !== null);
}