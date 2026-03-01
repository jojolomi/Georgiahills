import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter"
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  preload: true,
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
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/hero-home-640.avif" type="image/avif" />
        <link rel="preload" as="image" href="/hero-home-1024.avif" type="image/avif" />
        <link rel="preload" as="image" href="/hero-home-1600.avif" type="image/avif" />
      </head>
      <body className={`${inter.variable} ${notoSansArabic.variable}`}>
        {children}
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
