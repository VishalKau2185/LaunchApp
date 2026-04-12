"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"

export async function updatePassword(formData: FormData): Promise<{ error?: string; success?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const current  = formData.get("current_password") as string
  const next     = formData.get("new_password") as string
  const confirm  = formData.get("confirm_password") as string

  if (!current || !next || !confirm) return { error: "All fields are required." }
  if (next.length < 6)              return { error: "New password must be at least 6 characters." }
  if (next !== confirm)             return { error: "Passwords do not match." }

  // Re-authenticate with current password to verify it
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: current,
  })
  if (signInError) return { error: "Current password is incorrect." }

  const { error } = await supabase.auth.updateUser({ password: next })
  if (error) return { error: error.message }

  return { success: "Password updated successfully." }
}

export async function deleteAccount(): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = createAdminClient()

  // Wipe all user data first
  await admin.from("daily_opportunities").delete().eq("user_id", user.id)
  await admin.from("user_communities").delete().eq("user_id", user.id)
  await admin.from("startups").delete().eq("user_id", user.id)

  // Delete the auth account
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) return { error: error.message }

  // Sign out and go to landing
  await supabase.auth.signOut()
  revalidatePath("/")
  redirect("/")
}
