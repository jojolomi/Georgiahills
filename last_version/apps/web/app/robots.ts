import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://georgiahills.com";

function isStagingEnvironment() {
  const explicit = String(process.env.ROBOTS_DISALLOW_ALL || "").toLowerCase() === "true";
  const vercelPreview = String(process.env.VERCEL_ENV || "").toLowerCase() === "preview";
  const appEnv = String(process.env.NEXT_PUBLIC_APP_ENV || "").toLowerCase() === "staging";

  return explicit || vercelPreview || appEnv;
}

export default function robots(): MetadataRoute.Robots {
  const disallowAll = isStagingEnvironment();

  if (disallowAll) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/"
        }
      ],
      sitemap: `${siteUrl}/sitemap.xml`
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      },
      {
        userAgent: "GPTBot",
        allow: "/"
      },
      {
        userAgent: "Google-Extended",
        allow: "/"
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}