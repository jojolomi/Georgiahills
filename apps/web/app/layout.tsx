import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-inter"
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
  variable: "--font-arabic"
});

export const metadata: Metadata = {
  title: "Georgiahills Web",
  description: "Next.js 14 App Router scaffold"
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const gtagId = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_GTAG_ID : undefined;

  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="/hero-home-1024.avif"
          type="image/avif"
          fetchPriority="high"
          imageSrcSet="/hero-home-640.avif 640w, /hero-home-1024.avif 1024w, /hero-home-1600.avif 1600w"
          imageSizes="(max-width: 768px) calc(100vw - 128px), 640px"
        />
      </head>
      <body className={`${inter.variable} ${notoSansArabic.variable}`}>
        {children}
        {gtagId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
              strategy="afterInteractive"
            />
            <Script id="gh-ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gtagId}', { anonymize_ip: true });`}
            </Script>
          </>
        ) : null}
        <footer className="border-t border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-700">
          <nav className="flex flex-wrap justify-center gap-4">
            <a className="underline-offset-2 hover:underline focus-visible:underline" href="/privacy">Privacy Policy</a>
            <a className="underline-offset-2 hover:underline focus-visible:underline" href="/terms">Terms of Service</a>
            <a className="underline-offset-2 hover:underline focus-visible:underline" href="/cancellation">Cancellation Policy</a>
            <a className="underline-offset-2 hover:underline focus-visible:underline" href="/insurance">Travel Insurance</a>
            <a className="underline-offset-2 hover:underline focus-visible:underline" href="/licensing">Licensing</a>
          </nav>
          <p className="mt-2">&copy; {new Date().getFullYear()} Georgia Hills</p>
        </footer>
      </body>
    </html>
  );
}
