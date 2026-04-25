# Snippets & Helpers

## Hreflang head helper (React)

Path: `src/components/HreflangHead.js`

```jsx
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
```

## WhatsApp CTA format

`https://wa.me/<countrycode><phone>?text=<url-encoded-message>`

Example:

```html
<a href="https://wa.me/995551234567?text=%D8%A3%D8%B5%D9%84%D9%8E%D9%83%20%D9%84%D9%84%D8%A3%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20-%20%20https://example.com/ar/tbilisi-tour" target="_blank" rel="noopener">احجز عبر واتساب</a>
```

Helper component path: `src/components/WhatsAppCTA.js`
