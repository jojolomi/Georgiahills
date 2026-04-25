import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type ContentLocale = "en" | "ar";
export type ContentCollection = "blog" | "destinations";

export type ContentFrontmatter = {
  title: string;
  slug: string;
  description: string;
  lang?: ContentLocale;
  author?: string;
  reviewerName?: string;
  reviewedDate?: string;
  metaTitle?: string;
  metaDescription?: string;
  date?: string;
  locale: ContentLocale;
  image?: string;
  faq?: Array<{ question: string; answer: string }>;
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
  const faqRaw = Array.isArray(data.faq) ? data.faq : undefined;
  const faq = faqRaw
    ?.map((item) => {
      const record = item as Record<string, unknown>;
      const question = typeof record.question === "string" ? record.question : "";
      const answer = typeof record.answer === "string" ? record.answer : "";
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((item): item is { question: string; answer: string } => item !== null);

  const metaTitle = data.metaTitle ?? data.meta_title;
  const metaDescription = data.metaDescription ?? data.meta_description;
  const date = data.date ?? data.publish_date;
  const reviewerName = data.reviewerName ?? data.reviewer_name ?? data.author;
  const reviewedDate = data.reviewedDate ?? data.reviewed_date;

  return {
    title: String(data.title || fallbackSlug),
    slug: String(data.slug || fallbackSlug),
    description: String(data.description || ""),
    lang: data.lang ? String(data.lang) as ContentLocale : undefined,
    author: data.author ? String(data.author) : undefined,
    reviewerName: reviewerName ? String(reviewerName) : undefined,
    reviewedDate: reviewedDate ? String(reviewedDate) : undefined,
    metaTitle: metaTitle ? String(metaTitle) : undefined,
    metaDescription: metaDescription ? String(metaDescription) : undefined,
    date: date ? String(date) : undefined,
    locale,
    image: data.image ? String(data.image) : undefined,
    faq
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