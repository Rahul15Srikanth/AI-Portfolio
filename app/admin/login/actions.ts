"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * Sign in with email + password via Supabase Auth.
 * Called from the admin login form as a Server Action.
 */
export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/admin/login?error=Missing+credentials");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin/login?error=Invalid+email+or+password");
  }

  redirect("/admin");
}

/**
 * Sign out the current admin session.
 * Called from the admin dashboard as a Server Action.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
