import { NextResponse } from "next/server";
import { z } from "zod";
import { sendGA4MeasurementEvent } from "../../../../lib/server/ga4";
import { serverLogger } from "../../../../lib/server/logger";
import { captureServerException } from "../../../../lib/server/sentry";

const ga4EventSchema = z.object({
  clientId: z.string().min(3).max(128).optional(),
  eventName: z.string().min(2).max(80),
  params: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
  debug: z.boolean().optional()
});

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validated = ga4EventSchema.safeParse(payload);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "validation_failed",
          issues: validated.error.flatten()
        },
        { status: 400 }
      );
    }

    const body = validated.data;
    const result = await sendGA4MeasurementEvent({
      clientId: body.clientId,
      eventName: body.eventName,
      params: body.params,
      debug: body.debug
    });

    serverLogger.info("analytics.ga4.event", {
      eventName: body.eventName,
      ip: getClientIp(request),
      result
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const eventId = captureServerException(error, { endpoint: "/api/analytics/ga4" });
    serverLogger.error("analytics.ga4.error", {
      eventId,
      message: error instanceof Error ? error.message : String(error)
    });

    return NextResponse.json(
      {
        error: "ga4_forward_failed",
        eventId,
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
