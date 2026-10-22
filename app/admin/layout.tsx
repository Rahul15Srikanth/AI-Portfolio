import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "./login/actions";
import { Sparkles, LogOut } from "lucide-react";

/**
 * Admin layout — the authoritative server-side authorization gate.
 *
 * Security model:
 * 1. Calls supabase.auth.getUser() (not getSession()) which validates the JWT
 *    against the Supabase Auth server on every request.
 * 2. Checks that the authenticated user's ID matches ADMIN_USER_ID exactly.
 *    No other Supabase user can access /admin even if they somehow authenticate.
 * 3. Middleware only refreshes session tokens — it does NOT enforce auth.
 *    This layout is the real authorization checkpoint.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Use getUser() not getSession() — getUser() validates the JWT server-side
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Redirect unauthenticated visitors to login
  if (error || !user) {
    redirect("/admin/login");
  }

  // Enforce specific admin user ID — not just "any authenticated user"
  const adminUserId = process.env.ADMIN_USER_ID;
  if (!adminUserId || user.id !== adminUserId) {
    // Sign out the non-admin user and redirect
    await supabase.auth.signOut();
    redirect("/admin/login?error=Access+denied");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin top bar */}
      <header className="border-b border-white/10 bg-background/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              LUNA Analytics
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              / Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">{children}</main>
    </div>
  );
}
