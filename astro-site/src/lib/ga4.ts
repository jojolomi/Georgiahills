/**
 * ga4.ts — shared GA4 event tracking utility for astro-site browser scripts.
 *
 * Usage in a <script> tag:
 *   import { attachGa4Listeners } from "../lib/ga4";
 *   attachGa4Listeners();
 *
 * Elements must carry data-ga4-event (required) and data-ga4-label (optional).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function attachGa4Listeners(root: Document | Element = document): void {
  root.querySelectorAll("[data-ga4-event]").forEach((el) => {
    el.addEventListener(
      "click",
      () => {
        const dataset = (el as HTMLElement).dataset;
        const eventName = dataset.ga4Event;
        const label = dataset.ga4Label ?? "";
        if (typeof window.gtag === "function" && eventName) {
          window.gtag("event", eventName, { event_label: label });
        }
      },
      { once: true }
    );
  });
}
