import { NextResponse } from "next/server";
import { captureServerException, ensureServerSentryInitialized } from "../../../../lib/server/sentry";

export async function GET(request: Request) {
  ensureServerSentryInitialized();

  const url = new URL(request.url);
  const simulate = url.searchParams.get("simulate") === "1";

  if (!simulate) {
    return NextResponse.json({
      ok: true,
      message: "Append ?simulate=1 to capture a test server exception in Sentry.",
      dsnConfigured: Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN)
    });
  }

  const error = new Error("Sentry dev simulation: server-side monitoring probe.");
  const eventId = captureServerException(error, {
    endpoint: "/api/monitoring/sentry-test",
    simulation: true
  });

  return NextResponse.json({
    ok: true,
    simulated: true,
    eventId,
    dsnConfigured: Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN)
  });
}
