import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        {children}
        <footer className="border-t border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
          <nav className="flex flex-wrap justify-center gap-4">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cancellation">Cancellation Policy</a>
            <a href="/insurance">Travel Insurance</a>
            <a href="/licensing">Licensing</a>
          </nav>
          <p className="mt-2">&copy; {new Date().getFullYear()} Georgia Hills</p>
        </footer>
      </body>
    </html>
  );
}
