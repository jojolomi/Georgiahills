/** @type {import('next').NextConfig} */
const withBundleAnalyzer = (() => {
  if (process.env.ANALYZE !== "true") {
    return (config) => config;
  }

  try {
    return require("@next/bundle-analyzer")({
      enabled: true
    });
  } catch {
    return (config) => config;
  }
})();

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  basePath: (() => {
    if (process.env.GITHUB_PAGES !== "true") return "";
    const repository = process.env.GITHUB_REPOSITORY || "";
    const owner = (process.env.GITHUB_REPOSITORY_OWNER || "").toLowerCase();
    const repoName = repository.split("/")[1] || "";
    if (!repoName) return "";
    if (repoName.toLowerCase() === `${owner}.github.io`) return "";
    return `/${repoName}`;
  })(),
  assetPrefix: (() => {
    if (process.env.GITHUB_PAGES !== "true") return undefined;
    const repository = process.env.GITHUB_REPOSITORY || "";
    const owner = (process.env.GITHUB_REPOSITORY_OWNER || "").toLowerCase();
    const repoName = repository.split("/")[1] || "";
    if (!repoName) return undefined;
    if (repoName.toLowerCase() === `${owner}.github.io`) return undefined;
    return `/${repoName}`;
  })(),
  transpilePackages: ["@gh/ui", "@gh/lib", "@gh/types"],
  pageExtensions: ["tsx", "jsx", "js"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7
  },
  async redirects() {
    const mapping = [
      ["tbilisi", "tbilisi-day-tour"],
      ["batumi", "batumi-tour"],
      ["kazbegi", "kazbegi-tour"],
      ["gudauri", "gudauri-tour"],
      ["svaneti", "svaneti-tour"],
      ["kakheti", "kakheti-tour"]
    ];

    return [
      ...mapping.flatMap(([legacy, canonical]) => [
        {
          source: `/tours/${legacy}`,
          destination: `/en/tours/${canonical}`,
          permanent: true
        },
        {
          source: `/ar/tours/${legacy}`,
          destination: `/ar/tours/${canonical}`,
          permanent: true
        },
        {
          source: `/en/destinations/${legacy}`,
          destination: `/en/tours/${canonical}`,
          permanent: true
        }
      ])
    ];
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        source: "/:path*.(avif|webp|png|jpg|jpeg|gif|svg|ico|woff|woff2)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        source: "/:path*",
        has: [
          {
            type: "header",
            key: "accept",
            value: ".*text/html.*"
          }
        ],
        missing: [
          {
            type: "header",
            key: "x-nextjs-data"
          }
        ],
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=604800"
          }
        ]
      }
    ];
  }
};

module.exports = withBundleAnalyzer(nextConfig);
