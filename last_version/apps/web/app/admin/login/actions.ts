"use server";

import { redirect } from "next/navigation";
import { resolveAdminRole } from "../../../lib/server/admin-auth";
import { createSupabaseServerClient } from "../../../lib/server/supabase";

function safeNextPath(input: string | null | undefined) {
  if (!input || !input.startsWith("/")) return "/admin";
  if (input.startsWith("//")) return "/admin";
  return input;
}

export async function adminLoginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const nextPath = safeNextPath(String(formData.get("next") || "/admin"));

  if (!email || !password) {
    redirect(`/admin/login?error=missing_fields&next=${encodeURIComponent(nextPath)}`);
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    redirect(`/admin/login?error=auth_unavailable&next=${encodeURIComponent(nextPath)}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=invalid_credentials&next=${encodeURIComponent(nextPath)}`);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const role = resolveAdminRole(user);
  if (!role) {
    await supabase.auth.signOut();
    redirect(`/admin/login?error=insufficient_role&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath);
}
