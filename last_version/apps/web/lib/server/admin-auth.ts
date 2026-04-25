import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase";

export const ADMIN_ROLES = ["SuperAdmin", "Editor", "Support"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export function normalizeAdminRole(value: unknown): AdminRole | null {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "superadmin") return "SuperAdmin";
  if (normalized === "editor") return "Editor";
  if (normalized === "support") return "Support";
  return null;
}

export function resolveAdminRole(user: User | null | undefined): AdminRole | null {
  if (!user) return null;
  const appMetaRole = normalizeAdminRole(user.app_metadata?.role);
  if (appMetaRole) return appMetaRole;
  const userMetaRole = normalizeAdminRole(user.user_metadata?.role);
  if (userMetaRole) return userMetaRole;
  return null;
}

export async function requireAdminSession(allowedRoles?: AdminRole[]) {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    redirect("/admin/login?error=auth_unavailable");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login?next=/admin");
  }

  const role = resolveAdminRole(user);
  if (!role) {
    redirect("/admin/login?error=insufficient_role");
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    redirect("/admin?error=insufficient_role");
  }

  return { supabase, user, role };
}
