import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import { FooterLinks } from "../components/FooterLinks.client";
import { FloatingContactCta } from "../components/FloatingContactCta.client";
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
  title: "Georgia Hills",
  description: "Premium private driver and tour services across Georgia. From Tbilisi to Kazbegi, Batumi, and beyond.",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || ""
    }
  },
  icons: {
    icon: "/favicon.webp",
    shortcut: "/favicon.webp"
  }
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: RootLayoutProps) {
  const gtagId = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_GTAG_ID : undefined;
  const requestHeaders = headers();
  const headerPath =
    requestHeaders.get("x-pathname") ||
    requestHeaders.get("next-url") ||
    requestHeaders.get("x-invoke-path") ||
    "";
  const localeFromPath = headerPath.startsWith("/ar") ? "ar" : "en";
  const locale = requestHeaders.get("x-locale") === "ar" ? "ar" : localeFromPath;
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
      </head>
      <body className={`${inter.variable} ${notoSansArabic.variable}`}>
        {children}
        <FloatingContactCta />
        {gtagId ? (
          <>
            <Script id="gh-ga4-on-interaction" strategy="afterInteractive">
              {`(function(){
  var loaded=false;
  function loadGA(){
    if(loaded) return;
    loaded=true;
    var script=document.createElement('script');
    script.async=true;
    script.src='https://www.googletagmanager.com/gtag/js?id=${gtagId}';
    document.head.appendChild(script);
    window.dataLayer=window.dataLayer||[];
    function gtag(){window.dataLayer.push(arguments);} 
    window.gtag=window.gtag||gtag;
    window.gtag('js', new Date());
    window.gtag('config', '${gtagId}', { anonymize_ip: true });
    ['pointerdown','keydown','scroll','touchstart'].forEach(function(eventName){
      window.removeEventListener(eventName, loadGA, {passive:true});
    });
  }
  ['pointerdown','keydown','scroll','touchstart'].forEach(function(eventName){
    window.addEventListener(eventName, loadGA, {once:true, passive:true});
  });
})();`}
            </Script>
          </>
        ) : null}
        <footer className="border-t border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-700">
          <FooterLinks />
          <p className="mt-2">&copy; {new Date().getFullYear()} Georgia Hills</p>
        </footer>
      </body>
    </html>
  );
}
