import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import Script from "next/script";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const FloatingContactCta = dynamic(
  () => import("../components/FloatingContactCta.client").then((module) => module.FloatingContactCta),
  { ssr: false }
);

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "optional",
  preload: true,
  variable: "--font-inter"
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "optional",
  preload: true,
  variable: "--font-arabic"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://georgiahills.com"),
  title: "Georgia Hills",
  description: "Premium private driver and tour services across Georgia. From Tbilisi to Kazbegi, Batumi, and beyond.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Georgia Hills",
    description: "Premium private driver and tour services across Georgia. From Tbilisi to Kazbegi, Batumi, and beyond.",
    type: "website",
    url: "/",
    siteName: "Georgia Hills",
    images: ["/hero-home-1600.avif"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Georgia Hills",
    description: "Premium private driver and tour services across Georgia. From Tbilisi to Kazbegi, Batumi, and beyond.",
    images: ["/hero-home-1600.avif"]
  },
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
  userScalable: true,
  themeColor: "#ffffff",
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
  const cspNonce = requestHeaders.get("x-csp-nonce") || undefined;
  const isLandingPerformanceRoute = headerPath === "/en" || headerPath === "/ar";
  const footerLinks = [
    { href: locale === "ar" ? "/ar/privacy" : "/en/privacy", label: locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy" },
    {
      href: locale === "ar" ? "/ar/terms" : "/en/terms",
      label: locale === "ar" ? "الشروط والأحكام" : "Terms & Conditions"
    },
    {
      href: locale === "ar" ? "/ar/refund" : "/en/refund",
      label: locale === "ar" ? "سياسة الاسترداد" : "Refund Policy"
    },
    { href: "tel:+995579088537", label: "+995 579 08 85 37" },
    { href: "https://wa.me/995579088537", label: "WhatsApp" }
  ];

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      <body className={`${inter.variable} ${notoSansArabic.variable}`}>
        {children}
        {!isLandingPerformanceRoute ? <FloatingContactCta /> : null}
        {gtagId ? (
          <>
            <Script id="gh-ga4-on-interaction" strategy="afterInteractive" nonce={cspNonce}>
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
          <nav className="flex flex-wrap justify-center gap-4">
            {footerLinks.map((link) => (
              <a key={link.href + link.label} className="underline-offset-2 hover:underline focus-visible:underline" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <p className="mt-2">&copy; {new Date().getFullYear()} Georgia Hills</p>
        </footer>
      </body>
    </html>
  );
}
