export function getServerEnv() {
  return {
    databaseUrl: process.env.DATABASE_URL || "",
    supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
    supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE || "",
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://georgiahills.com"
  };
}

export function isProd() {
  return process.env.NODE_ENV === "production";
}