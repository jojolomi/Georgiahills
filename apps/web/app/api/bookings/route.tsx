import { NextResponse } from "next/server";
import { z } from "zod";
import { createBooking } from "../../../lib/server/bookings-store";
import { serverLogger } from "../../../lib/server/logger";
import { sendGA4MeasurementEvent } from "../../../lib/server/ga4";
import { captureServerException } from "../../../lib/server/sentry";

const bookingSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(6).max(32).optional(),
  destinationSlug: z.string().min(2).max(120),
  travelDate: z.string().min(4),
  guests: z.number().int().min(1).max(30),
  amount: z.number().nonnegative().optional(),
  currency: z.string().length(3).optional(),
  notes: z.string().max(2000).optional()
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const gaClientId = request.headers.get("x-ga-client-id") || undefined;

    const payload = await request.json();
    const validated = bookingSchema.safeParse(payload);

    if (!validated.success) {
      serverLogger.warn("booking.validation_failed", {
        ip,
        issues: validated.error.flatten()
      });

      return NextResponse.json(
        {
          error: "Validation failed",
          issues: validated.error.flatten()
        },
        { status: 400 }
      );
    }

    const booking = await createBooking({
      ...validated.data,
      paymentStatus: "unpaid"
    });

    serverLogger.info("booking.created", {
      bookingId: booking.id,
      email: validated.data.email,
      destinationSlug: validated.data.destinationSlug,
      guests: validated.data.guests,
      ip,
      userAgent
    });

    try {
      const gaResult = await sendGA4MeasurementEvent({
        clientId: gaClientId,
        eventName: "booking_created",
        params: {
          booking_id: booking.id,
          destination_slug: validated.data.destinationSlug,
          guests: validated.data.guests,
          travel_date: validated.data.travelDate,
          currency: validated.data.currency || "USD",
          value: Number(validated.data.amount || 0)
        },
        debug: process.env.NODE_ENV !== "production"
      });

      serverLogger.info("booking.analytics.ga4", {
        bookingId: booking.id,
        result: gaResult
      });
    } catch (analyticsError) {
      const eventId = captureServerException(analyticsError, {
        source: "booking.route.ga4",
        bookingId: booking.id
      });

      serverLogger.warn("booking.analytics.ga4_failed", {
        bookingId: booking.id,
        eventId,
        message: analyticsError instanceof Error ? analyticsError.message : String(analyticsError)
      });
    }

    return NextResponse.json(
      {
        booking
      },
      { status: 201 }
    );
  } catch (error) {
    const eventId = captureServerException(error, {
      source: "booking.route",
      endpoint: "/api/bookings"
    });

    serverLogger.error("booking.create_failed", {
      eventId,
      message: error instanceof Error ? error.message : String(error)
    });

    return NextResponse.json(
      {
        error: "Failed to create booking",
        eventId,
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}