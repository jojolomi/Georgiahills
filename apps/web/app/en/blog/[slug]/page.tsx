import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { StructuredData } from "../../../../components/StructuredData";
import { getContentBySlug, getContentSlugs } from "../../../../lib/content";
import { buildPageMetadata } from "../../../../lib/seo";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const slugs = await getContentSlugs("blog", "en");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const entry = await getContentBySlug("blog", "en", params.slug);

  if (!entry) {
    return {
      title: "Blog Post Not Found"
    };
  }

  return buildPageMetadata({
    title: entry.frontmatter.metaTitle || entry.frontmatter.title,
    description: entry.frontmatter.metaDescription || entry.frontmatter.description,
    path: `/en/blog/${entry.frontmatter.slug}`,
    alternates: {
      en: `https://georgiahills.com/en/blog/${entry.frontmatter.slug}`,
      ar: `https://georgiahills.com/ar/blog/${entry.frontmatter.slug}`,
      "x-default": `https://georgiahills.com/en/blog/${entry.frontmatter.slug}`
    },
    images: entry.frontmatter.image ? [entry.frontmatter.image] : undefined
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const entry = await getContentBySlug("blog", "en", params.slug);

  if (!entry) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <StructuredData
        type="BlogPosting"
        data={{
          headline: entry.frontmatter.title,
          description: entry.frontmatter.description,
          inLanguage: "en",
          datePublished: entry.frontmatter.date || undefined,
          image: entry.frontmatter.image
            ? `https://georgiahills.com${entry.frontmatter.image}`
            : undefined,
          author: { "@type": "Organization", name: "Georgia Hills" },
          publisher: { "@type": "Organization", name: "Georgia Hills" }
        }}
      />
      <article className="prose prose-slate mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500">{entry.frontmatter.date || ""}</p>
        <h1>{entry.frontmatter.title}</h1>
        <p>{entry.frontmatter.description}</p>
        <MDXRemote
          source={entry.content}
          components={{
            h1: ({ children }) => (
              <h2 className="mt-8 text-3xl font-semibold tracking-tight text-slate-900">{children}</h2>
            )
          }}
        />
      </article>
    </main>
  );
}