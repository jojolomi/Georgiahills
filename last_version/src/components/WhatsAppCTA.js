export default function WhatsAppCTA({
  phone = "995551234567",
  message = "أصلك للاستفسار",
  pageUrl = "https://example.com/ar/tbilisi-tour",
  label = "احجز عبر واتساب"
}) {
  const text = encodeURIComponent(`${message} - ${pageUrl}`);
  const href = `https://wa.me/${phone}?text=${text}`;

  return (
    <a href={href} target="_blank" rel="noopener">
      {label}
    </a>
  );
}
