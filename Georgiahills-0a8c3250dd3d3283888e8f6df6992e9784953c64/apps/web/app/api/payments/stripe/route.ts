import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { updateBookingPaymentState } from "../../../../lib/server/bookings-store";
import { getServerEnv } from "../../../../lib/server/env";

const paymentSchema = z.object({
  bookingId: z.string().uuid(),
  amount: z.number().int().positive(),
  currency: z.string().length(3),
  customerEmail: z.string().email(),
  description: z.string().max(240).optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = paymentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: validated.error.flatten() },
        { status: 400 }
      );
    }

    const env = getServerEnv();

    if (!env.stripeSecretKey) {
      const sessionId = `cs_test_mock_${validated.data.bookingId}`;
      await updateBookingPaymentState({
        bookingId: validated.data.bookingId,
        paymentStatus: "checkout_created",
        stripeSessionId: sessionId
      });

      return NextResponse.json({ sessionId, mode: "mock" }, { status: 200 });
    }

    const stripe = new Stripe(env.stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: validated.data.customerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: validated.data.currency.toLowerCase(),
            unit_amount: validated.data.amount,
            product_data: {
              name: validated.data.description || "Georgia Hills Booking"
            }
          }
        }
      ],
      metadata: {
        bookingId: validated.data.bookingId
      },
      success_url: `${env.siteUrl}/en?payment=success&booking=${validated.data.bookingId}`,
      cancel_url: `${env.siteUrl}/en?payment=cancelled&booking=${validated.data.bookingId}`
    });

    await updateBookingPaymentState({
      bookingId: validated.data.bookingId,
      paymentStatus: "checkout_created",
      stripeSessionId: session.id
    });

    return NextResponse.json({ sessionId: session.id, url: session.url }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create Stripe session", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}