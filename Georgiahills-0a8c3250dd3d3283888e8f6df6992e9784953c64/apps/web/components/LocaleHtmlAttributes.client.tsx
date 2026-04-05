"use client";

import { useEffect } from "react";

type LocaleHtmlAttributesProps = {
  lang: string;
  dir: "ltr" | "rtl";
};

export function LocaleHtmlAttributes({ lang, dir }: LocaleHtmlAttributesProps) {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", dir);

    return () => {
      html.setAttribute("lang", "en");
      html.setAttribute("dir", "ltr");
    };
  }, [lang, dir]);

  return null;
}
