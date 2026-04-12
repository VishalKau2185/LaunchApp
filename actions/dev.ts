"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { DEV_OFFSET_COOKIE, getSimulatedDate } from "@/lib/dev-date"

export async function regeneratePlan() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const cookieStore = await cookies()
  const offset = parseInt(cookieStore.get(DEV_OFFSET_COOKIE)?.value ?? "0", 10)
  const date = getSimulatedDate(offset)

  const admin = createAdminClient()
  await admin.from("daily_opportunities").delete().eq("user_id", user.id).eq("date", date)

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function resetTodaysPlan() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const cookieStore = await cookies()
  const offset = parseInt(cookieStore.get(DEV_OFFSET_COOKIE)?.value ?? "0", 10)
  const date = getSimulatedDate(offset)

  const admin = createAdminClient()
  await admin.from("daily_opportunities").delete().eq("user_id", user.id).eq("date", date)

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function simulateNextDay() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = createAdminClient()
  const cookieStore = await cookies()

  const currentOffset = parseInt(cookieStore.get(DEV_OFFSET_COOKIE)?.value ?? "0", 10)
  const currentDate = getSimulatedDate(currentOffset)

  // Mark today's Reddit posts as done so they count as rotation history
  await admin
    .from("daily_opportunities")
    .update({ status: "done" })
    .eq("user_id", user.id)
    .eq("date", currentDate)
    .eq("platform", "reddit")

  // Advance the day
  const newOffset = currentOffset + 1
  cookieStore.set(DEV_OFFSET_COOKIE, String(newOffset), {
    path: "/",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function clearAllHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = createAdminClient()
  const cookieStore = await cookies()

  await admin.from("daily_opportunities").delete().eq("user_id", user.id)
  await admin.from("user_communities").delete().eq("user_id", user.id)
  await admin.from("startups").delete().eq("user_id", user.id)

  cookieStore.set(DEV_OFFSET_COOKIE, "0", { path: "/", httpOnly: false, maxAge: 60 * 60 * 24 * 30 })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function markAllDoneToday() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = createAdminClient()
  const cookieStore = await cookies()
  const offset = parseInt(cookieStore.get(DEV_OFFSET_COOKIE)?.value ?? "0", 10)
  const date = getSimulatedDate(offset)

  await admin.from("daily_opportunities").update({ status: "done" }).eq("user_id", user.id).eq("date", date)

  revalidatePath("/dashboard")
  redirect("/dashboard")
}
