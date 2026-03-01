/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@gh/ui", "@gh/lib", "@gh/types"],
  pageExtensions: ["tsx", "jsx", "js"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  }
};

module.exports = nextConfig;
