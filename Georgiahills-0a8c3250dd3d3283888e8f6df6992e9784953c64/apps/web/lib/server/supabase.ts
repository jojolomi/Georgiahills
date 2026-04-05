import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getServerEnv } from "./env";

function getAuthConfig() {
  const env = getServerEnv();
  const url = env.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = env.supabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return { url, anonKey };
}

export function createSupabaseServerClient() {
  const { url, anonKey } = getAuthConfig();
  if (!url || !anonKey) {
    return null;
  }

  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(items) {
        try {
          for (const { name, value, options } of items) {
            cookieStore.set(name, value, options as CookieOptions);
          }
        } catch {
          // Setting cookies is not available in some server component contexts.
        }
      }
    }
  });
}

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getAuthConfig();
  if (!url || !anonKey) {
    throw new Error("Supabase auth is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.");
  }

  return createClient(url, anonKey);
}
