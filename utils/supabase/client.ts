"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a browser-side Supabase client.
 * Only used in Client Components that need to interact with Supabase Auth
 * (e.g., the admin login page). Uses the ANON key only — never the service role.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
