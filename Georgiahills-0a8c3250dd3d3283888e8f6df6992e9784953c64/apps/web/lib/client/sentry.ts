"use client";

import * as Sentry from "@sentry/nextjs";

let initialized = false;

export function ensureClientSentryInitialized() {
  if (initialized) return;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || "";
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || 0)
  });

  initialized = true;
}

export function captureClientException(error: unknown, context?: Record<string, unknown>) {
  ensureClientSentryInitialized();
  if (!(process.env.NEXT_PUBLIC_SENTRY_DSN || "")) return null;

  return Sentry.withScope((scope) => {
    if (context) {
      for (const [key, value] of Object.entries(context)) {
        scope.setExtra(key, value as never);
      }
    }
    return Sentry.captureException(error);
  });
}
