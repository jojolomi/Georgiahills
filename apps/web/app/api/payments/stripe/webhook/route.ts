import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createHmac, timingSafeEqual } from "node:crypto";
import { handleStripeWebhookEvent } from "../webhook";
import { getServerEnv } from "../../../../../lib/server/env";

function verifySimulatedSignature(payload: string, signature: string, secret: string) {
  const computed = createHmac("sha256", secret).update(payload).digest("hex");
  const provided = signature.replace(/^v1=/, "").trim();

  const left = Buffer.from(computed);
  const right = Buffer.from(provided);

  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  const env = getServerEnv();
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  try {
    if (!signature || !env.stripeWebhookSecret) {
      return NextResponse.json({ error: "Missing webhook signature configuration" }, { status: 400 });
    }

    if (signature.startsWith("v1=") && !signature.includes("t=")) {
      const verified = verifySimulatedSignature(rawBody, signature, env.stripeWebhookSecret);
      if (!verified) {
        return NextResponse.json({ error: "Simulated signature verification failed" }, { status: 400 });
      }

      const simulatedEvent = JSON.parse(rawBody) as Stripe.Event;
      await handleStripeWebhookEvent(simulatedEvent);
      return NextResponse.json({ received: true, mode: "simulated-signature" }, { status: 200 });
    }

    if (!env.stripeSecretKey) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY for Stripe signature flow" }, { status: 500 });
    }

    const stripe = new Stripe(env.stripeSecretKey);
    const event = stripe.webhooks.constructEvent(rawBody, signature, env.stripeWebhookSecret);
    await handleStripeWebhookEvent(event);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook verification failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}