"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/server/supabase";

export async function adminLogoutAction() {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    redirect("/admin/login");
  }

  await supabase.auth.signOut();
  redirect("/admin/login");
}
