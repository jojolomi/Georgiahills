export function getServerEnv() {
  return {
    databaseUrl: process.env.DATABASE_URL || "",
    supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
    supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE || "",
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    sentryDsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "",
    ga4MeasurementId: process.env.GA4_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
    ga4ApiSecret: process.env.GA4_API_SECRET || "",
    ga4TestEventCode: process.env.GA4_TEST_EVENT_CODE || "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://georgiahills.com"
  };
}

export function isProd() {
  return process.env.NODE_ENV === "production";
}