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
      <body>{children}</body>
    </html>
  );
}
