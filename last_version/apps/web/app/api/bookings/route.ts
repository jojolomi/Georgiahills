import { NextResponse } from "next/server";
import { z } from "zod";
import { createBooking } from "../../../lib/server/bookings-store";

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
    const payload = await request.json();
    const validated = bookingSchema.safeParse(payload);

    if (!validated.success) {
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

    return NextResponse.json(
      {
        booking
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create booking",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}