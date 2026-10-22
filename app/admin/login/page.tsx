import { signIn } from "./actions";
import { Sparkles } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export const metadata = {
  title: "Admin Login | Rahul Srikanth",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to the portfolio analytics dashboard
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {decodeURIComponent(error)}
          </div>
        )}

        {/* Login form */}
        <form action={signIn} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground/50">
          This area is restricted to the site administrator.
        </p>
      </div>
    </div>
  );
}
