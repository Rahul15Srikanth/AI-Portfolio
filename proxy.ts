import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/**
 * Next.js root proxy (previously called middleware).
 * Runs on every matched request to refresh the Supabase session JWT stored
 * in the user's cookies. This prevents sessions from silently expiring.
 *
 * Authorization (checking whether the user is actually the admin) is NOT
 * performed here. It is enforced inside app/admin/layout.tsx using
 * supabase.auth.getUser() inside a Server Component, which is the only
 * secure place to do it.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on all paths except:
     * - Next.js static assets (_next/static, _next/image)
     * - favicon.ico
     * - Public image files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
