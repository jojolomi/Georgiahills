import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { markets } from "../config/markets";
import { secondaryPages } from "../config/secondary-pages";

const base = "https://georgiahills.com";

type Entry = {
  loc: string;
  alternates?: Array<{ hreflang: string; href: string }>;
};

function absolute(path: string) {
  return `${base}${path}`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async () => {
  const allPosts = await getCollection("blog");
  const postIds = new Set(allPosts.map((p) => p.id.replace(/\.md$/, "")));
  const entries: Entry[] = [
    {
      loc: absolute("/"),
      alternates: [
        { hreflang: "en", href: absolute("/") },
        { hreflang: "ar", href: absolute("/arabic.html") },
        { hreflang: "x-default", href: absolute("/") }
      ]
    },
    {
      loc: absolute("/booking.html"),
      alternates: [
        { hreflang: "en", href: absolute("/booking.html") },
        { hreflang: "ar", href: absolute("/booking-ar.html") },
        { hreflang: "x-default", href: absolute("/booking.html") }
      ]
    },
    {
      loc: absolute("/blog.html"),
      alternates: [
        { hreflang: "en", href: absolute("/blog.html") },
        { hreflang: "ar", href: absolute("/blog-ar.html") },
        { hreflang: "x-default", href: absolute("/blog.html") }
      ]
    },
    {
      loc: absolute("/blog-ar.html"),
      alternates: [
        { hreflang: "ar", href: absolute("/blog-ar.html") },
        { hreflang: "en", href: absolute("/blog.html") },
        { hreflang: "x-default", href: absolute("/") }
      ]
    }
  ];

  for (const market of markets) {
    const loc = absolute(`/${market.code}.html`);
    entries.push({
      loc,
      alternates: [
        { hreflang: "ar", href: loc },
        { hreflang: "x-default", href: absolute("/") }
      ]
    });
  }

  for (const page of secondaryPages) {
    const loc = absolute(`/${page.slug}.html`);
    const alternates: Array<{ hreflang: string; href: string }> = [
      { hreflang: page.lang, href: loc },
      { hreflang: "x-default", href: absolute("/") }
    ];

    if (page.pairedSlug) {
      alternates.splice(1, 0, {
        hreflang: page.lang === "ar" ? "en" : "ar",
        href: absolute(`/${page.pairedSlug}.html`)
      });
    }

    entries.push({ loc, alternates });
  }

  for (const post of allPosts) {
    const cleanId = post.id.replace(/\.md$/, "");
    const loc = absolute(`/blog/${cleanId}.html`);
    const lang = post.data.lang;
    const isAr = lang === "ar";
    const baseSlug = cleanId.replace(/^(ar|en)\//, "");
    const pairedLang = isAr ? "en" : "ar";
    const pairedCleanId = `${pairedLang}/${baseSlug}`;
    const alternates: Array<{ hreflang: string; href: string }> = [
      { hreflang: lang, href: loc },
      { hreflang: "x-default", href: absolute("/") }
    ];
    if (postIds.has(pairedCleanId)) {
      alternates.splice(1, 0, {
        hreflang: pairedLang,
        href: absolute(`/blog/${pairedCleanId}.html`)
      });
    }
    entries.push({ loc, alternates });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
    .map((entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
${(entry.alternates || [])
    .map((alt) => `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}" />`)
    .join("\n")}
  </url>`)
    .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
