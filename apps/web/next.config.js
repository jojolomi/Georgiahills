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
  transpilePackages: ["@gh/ui", "@gh/lib", "@gh/types"],
  pageExtensions: ["tsx", "jsx", "js"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
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
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=60, stale-while-revalidate=300"
          }
        ]
      }
    ];
  }
};

module.exports = withBundleAnalyzer(nextConfig);
