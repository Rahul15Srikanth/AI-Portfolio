"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * Deletes a single conversation record by conversation_id.
 * Server-side auth is re-validated before the delete is performed.
 * RLS policies enforce that only the admin user can delete rows.
 */
export async function deleteConversation(formData: FormData) {
  const supabase = await createClient();

  // Re-validate the authenticated admin user on every delete request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminUserId = process.env.ADMIN_USER_ID;
  if (!user || user.id !== adminUserId) {
    redirect("/admin/login?error=Access+denied");
  }

  const conversationId = formData.get("id") as string;
  if (!conversationId || typeof conversationId !== "string") return;

  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("conversation_id", conversationId);

  if (error) {
    console.error("[admin] Delete failed:", error.message);
    return;
  }

  revalidatePath("/admin");
}
