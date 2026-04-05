import Stripe from "stripe";
import { updateBookingPaymentState } from "../../../../lib/server/bookings-store";

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        await updateBookingPaymentState({
          bookingId,
          paymentStatus: "paid",
          status: "paid",
          stripeSessionId: session.id
        });
      }
      break;
    }

    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const bookingId = intent.metadata?.bookingId;
      if (bookingId) {
        await updateBookingPaymentState({
          bookingId,
          paymentStatus: "paid",
          status: "paid"
        });
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const bookingId = intent.metadata?.bookingId;
      if (bookingId) {
        await updateBookingPaymentState({
          bookingId,
          paymentStatus: "failed",
          status: "failed"
        });
      }
      break;
    }

    default:
      break;
  }
}