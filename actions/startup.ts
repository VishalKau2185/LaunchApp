"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { extractKeywords } from "@/lib/ai/extract-keywords"

export async function saveStartup(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const website = formData.get("website") as string | null
  const category = formData.get("category") as string | null
  const targetAudience = formData.get("target_audience") as string | null
  const keywordsRaw = formData.get("keywords") as string

  let keywords: string[] = []
  if (keywordsRaw && keywordsRaw.trim()) {
    keywords = keywordsRaw.split(",").map((k) => k.trim()).filter(Boolean)
  } else {
    keywords = await extractKeywords(`${description} ${category || ""} ${targetAudience || ""}`)
  }

  const { data: existing } = await supabase
    .from("startups")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (existing) {
    const { error } = await supabase
      .from("startups")
      .update({
        name,
        description,
        website: website || null,
        category: category || null,
        target_audience: targetAudience || null,
        keywords,
        discovery_status: "in_progress",
      })
      .eq("id", existing.id)

    if (error) return { error: error.message }

    // Clear today's plan and the cached community pool — both will rebuild
    const today = new Date().toISOString().split("T")[0]
    await supabase.from("daily_opportunities").delete().eq("user_id", user.id).eq("date", today)
    await supabase.from("user_communities").delete().eq("user_id", user.id)
  } else {
    const { error } = await supabase
      .from("startups")
      .insert({
        user_id: user.id,
        name,
        description,
        website: website || null,
        category: category || null,
        target_audience: targetAudience || null,
        keywords,
        discovery_status: "in_progress",
      })

    if (error) return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/startup")
  redirect("/dashboard")
}

export async function getKeywordSuggestions(description: string): Promise<string[]> {
  if (!description || description.length < 20) return []
  return extractKeywords(description)
}

export async function retryDiscovery(startupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data: startup } = await supabase
    .from("startups")
    .select("id")
    .eq("id", startupId)
    .eq("user_id", user.id)
    .single()

  if (!startup) return { error: "Not found" }

  // Reset to in_progress — DiscoveryStatus component will re-trigger /api/discover
  await supabase.from("startups")
    .update({ discovery_status: "in_progress" })
    .eq("id", startupId)
    .eq("user_id", user.id)
  await supabase.from("user_communities").delete().eq("user_id", user.id)

  const today = new Date().toISOString().split("T")[0]
  await supabase.from("daily_opportunities").delete().eq("user_id", user.id).eq("date", today)

  revalidatePath("/dashboard")
}
