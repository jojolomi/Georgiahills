"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/server/supabase";

export async function logoutAction() {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    redirect("/login");
  }

  await supabase.auth.signOut();
  redirect("/login");
}
