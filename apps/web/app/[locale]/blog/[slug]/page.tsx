import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { StructuredDataGraph } from "../../../../components/StructuredData";
import { getContentBySlug, getContentSlugs } from "../../../../lib/content";
import { buildPageMetadata } from "../../../../lib/seo";
import { isSupportedLocale, locales, type Locale } from "../../../../lib/i18n";

type BlogPostPageProps = {
  params: {
    locale: string;
    slug: string;
  };
};

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (locale) => {
      const slugs = await getContentSlugs("blog", locale);
      return slugs.map((slug) => ({ locale, slug }));
    })
  );

  return params.flat();
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  if (!isSupportedLocale(params.locale)) {
    return { title: "Blog Post Not Found" };
  }

  const locale = params.locale as Locale;
  const entry = await getContentBySlug("blog", locale, params.slug);

  if (!entry) {
    return { title: "Blog Post Not Found" };
  }

  const counterpartLocale: Locale = locale === "ar" ? "en" : "ar";
  const counterpart = await getContentBySlug("blog", counterpartLocale, params.slug);
  const currentUrl = `https://georgiahills.com/${locale}/blog/${entry.frontmatter.slug}`;

  const languages: Record<string, string> = {
    [locale]: currentUrl,
    "x-default": counterpartLocale === "en" && counterpart
      ? `https://georgiahills.com/en/blog/${entry.frontmatter.slug}`
      : currentUrl
  };

  if (counterpart) {
    languages[counterpartLocale] = `https://georgiahills.com/${counterpartLocale}/blog/${entry.frontmatter.slug}`;
  }

  return buildPageMetadata({
    title: entry.frontmatter.metaTitle || entry.frontmatter.title,
    description: entry.frontmatter.metaDescription || entry.frontmatter.description,
    path: `/${locale}/blog/${entry.frontmatter.slug}`,
    alternates: languages,
    images: entry.frontmatter.image ? [entry.frontmatter.image] : undefined
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  if (!isSupportedLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const entry = await getContentBySlug("blog", locale, params.slug);

  if (!entry) {
    notFound();
  }

  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: `https://georgiahills.com/${locale}` },
    {
      "@type": "ListItem",
      position: 2,
      name: locale === "ar" ? "المدونة" : "Blog",
      item: `https://georgiahills.com/${locale}/blog/${entry.frontmatter.slug}`
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <StructuredDataGraph
        nodes={[
          {
            type: "Breadcrumb",
            data: {
              itemListElement: breadcrumbItems
            }
          },
          {
            type: "BlogPosting",
            data: {
              headline: entry.frontmatter.title,
              description: entry.frontmatter.description,
              datePublished: entry.frontmatter.date || undefined,
              image: entry.frontmatter.image ? `https://georgiahills.com${entry.frontmatter.image}` : undefined,
              inLanguage: locale,
              author: { "@type": "Organization", name: "Georgia Hills" },
              publisher: { "@type": "Organization", name: "Georgia Hills" }
            }
          },
          ...(entry.frontmatter.faq?.length
            ? [
                {
                  type: "FAQ" as const,
                  data: {
                    inLanguage: locale,
                    mainEntity: entry.frontmatter.faq.map((item) => ({
                      "@type": "Question",
                      name: item.question,
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: item.answer
                      }
                    }))
                  }
                }
              ]
            : [])
        ]}
      />
      <article className="prose prose-slate mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500">{entry.frontmatter.date || ""}</p>
        <p>{entry.frontmatter.description}</p>
        <MDXRemote source={entry.content} />
      </article>
    </main>
  );
}
