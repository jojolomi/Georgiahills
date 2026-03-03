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
  description: "Next.js 14 App Router scaffold",
  icons: {
    icon: "/favicon.webp",
    shortcut: "/favicon.webp"
  }
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const gtagId = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_GTAG_ID : undefined;

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/hero-home-640.avif"
          type="image/avif"
          fetchPriority="high"
          imageSrcSet="/hero-home-640.avif 640w, /hero-home-1024.avif 1024w"
          imageSizes="(max-width: 768px) calc(100vw - 128px), 512px"
        />
      </head>
      <body className={`${inter.variable} ${notoSansArabic.variable}`}>
        {children}
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
