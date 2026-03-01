import { notFound } from "next/navigation";
import { getDirection, isSupportedLocale, type Locale } from "../../lib/i18n";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  if (!isSupportedLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;

  return (
    <div lang={locale} dir={getDirection(locale)}>
      {children}
    </div>
  );
}