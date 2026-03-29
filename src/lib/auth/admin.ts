import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type AdminContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: User;
};

/** Redirects to /admin/login if not signed in or not in admin_users. */
export async function requireAdmin(): Promise<AdminContext> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminRow) {
    redirect("/admin/login?error=forbidden");
  }

  return { supabase, user };
}
