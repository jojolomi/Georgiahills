export default function HreflangHead({ path = "/" }) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const en = `${baseUrl}${cleanPath}`;
  const ar = `${baseUrl}/ar${cleanPath === "/" ? "" : cleanPath}`;

  return (
    <>
      <link rel="alternate" hrefLang="en" href={en} />
      <link rel="alternate" hrefLang="ar" href={ar} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/`} />
    </>
  );
}
