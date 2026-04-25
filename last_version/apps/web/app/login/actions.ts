"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/server/supabase";

function safeNextPath(input: string | null | undefined) {
  if (!input || !input.startsWith("/")) return "/account";
  if (input.startsWith("//")) return "/account";
  return input;
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const nextPath = safeNextPath(String(formData.get("next") || "/account"));

  if (!email || !password) {
    redirect(`/login?error=missing_fields&next=${encodeURIComponent(nextPath)}`);
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    redirect(`/login?error=auth_unavailable&next=${encodeURIComponent(nextPath)}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=invalid_credentials&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath);
}
