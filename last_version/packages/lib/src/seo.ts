export type SeoMetaInput = {
  title: string;
  description: string;
  canonicalUrl?: string;
};

export function buildSeoMeta(input: SeoMetaInput) {
  return {
    title: input.title,
    description: input.description,
    alternates: input.canonicalUrl ? { canonical: input.canonicalUrl } : undefined
  };
}