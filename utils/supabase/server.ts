import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Creates a server-side Supabase client using the ANON key + authenticated
 * user session stored in cookies. Safe to use in Server Components, layouts,
 * and API routes that need the user's own RLS-scoped access.
 *
 * Never use this with the service role key — use createServiceRoleClient()
 * for privileged server-side operations instead.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll may be called from a Server Component where cookies
            // cannot be set. The middleware will handle session refresh.
          }
        },
      },
    }
  );
}

/**
 * Creates a privileged server-side Supabase client using the service role key.
 * This bypasses RLS entirely. ONLY use this in trusted server-side API routes
 * (e.g. the webhook receiver). Never expose this client or its key to the browser.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
