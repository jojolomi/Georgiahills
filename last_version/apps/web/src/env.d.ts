/// <reference types="astro/client" />

interface Window {
  gtag?: (...args: unknown[]) => void;
  gtmLoaded?: boolean;
  GHIntegrations?: Record<string, string>;
  GHLoadFlags?: { legacy: boolean; marketing: boolean };
  dataLayer?: unknown[];
}
