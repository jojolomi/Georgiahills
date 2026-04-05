import * as Sentry from "@sentry/nextjs";

let initialized = false;

function getDsn() {
  return process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "";
}

export function ensureServerSentryInitialized() {
  if (initialized) return;

  const dsn = getDsn();
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0)
  });

  initialized = true;
}

export function captureServerException(error: unknown, context?: Record<string, unknown>) {
  ensureServerSentryInitialized();
  if (!getDsn()) return null;

  return Sentry.withScope((scope) => {
    if (context) {
      for (const [key, value] of Object.entries(context)) {
        scope.setExtra(key, value as never);
      }
    }

    return Sentry.captureException(error);
  });
}
