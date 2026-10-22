import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase session stored in cookies so it does not expire
 * between requests. Called inside the root middleware.ts.
 *
 * This function only refreshes session tokens — it does NOT enforce
 * authorization. Authorization is enforced inside each protected Server
 * Component layout using supabase.auth.getUser().
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not add authorization logic here.
  // getUser() is called here solely to refresh the session JWT.
  // The /admin layout enforces actual authorization server-side.
  await supabase.auth.getUser();

  return supabaseResponse;
}
