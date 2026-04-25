"use client";

import { usePathname } from "next/navigation";

export function FooterLinks() {
  const pathname = usePathname() || "/";
  const isArabic = pathname.startsWith("/ar");
  const prefix = isArabic ? "/ar" : "/en";

  const links = [
    { href: `${prefix}/privacy`, label: isArabic ? "سياسة الخصوصية" : "Privacy Policy" },
    { href: `${prefix}/terms`, label: isArabic ? "الشروط والأحكام" : "Terms & Conditions" },
    { href: `${prefix}/refund`, label: isArabic ? "سياسة الاسترداد" : "Refund Policy" },
    { href: `tel:+995579088537`, label: "+995 579 08 85 37" },
    { href: "https://wa.me/995579088537", label: "WhatsApp" }
  ];

  return (
    <nav className="flex flex-wrap justify-center gap-4">
      {links.map((link) => (
        <a key={link.href + link.label} className="underline-offset-2 hover:underline focus-visible:underline" href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}
