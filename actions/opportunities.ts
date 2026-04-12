"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  generateRedditPost,
  generateTwitterPost,
  generateFounderPost,
  generateBlogPost,
  generateDirectorySubmission,
  buildTwitterIntentUrl,
} from "@/lib/ai/generate-post"
import type { Platform } from "@/types/database"
import type { TemplateType } from "@/lib/templates/post-templates"

export async function markDone(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("daily_opportunities")
    .update({ status: "done" })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard")
  return {}
}

export async function regeneratePost(
  id: string,
  slotIndex: number
): Promise<{ title: string | null; body: string; templateType: TemplateType; post_url?: string } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Verify ownership before read or write
  const { data: opp } = await supabase
    .from("daily_opportunities")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!opp) return null

  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!startup) return null

  const startupInfo = {
    name:           startup.name,
    description:    startup.description,
    website:        startup.website,
    keywords:       startup.keywords ?? [],
    category:       startup.category,
    targetAudience: startup.target_audience,
  }

  const nextSlot = slotIndex + 10 // offset for template variety
  const platform = opp.platform as Platform

  let generated: { title: string | null; body: string; templateType: TemplateType }
  const updates: Record<string, unknown> = {
    regen_count: (opp.regen_count || 0) + 1,
  }

  if (platform === "reddit") {
    const urlMatch = opp.post_url.match(/reddit\.com\/r\/([^/?#]+)/)
    const communityName = urlMatch ? urlMatch[1] : "startups"
    generated = await generateRedditPost(startupInfo, communityName, nextSlot)
    updates.generated_title = generated.title
    updates.generated_body  = generated.body
    updates.template_type   = generated.templateType

  } else if (platform === "twitter") {
    generated = await generateTwitterPost(startupInfo, nextSlot)
    updates.generated_body = generated.body
    updates.template_type  = generated.templateType
    updates.post_url       = buildTwitterIntentUrl(generated.body)

  } else if (platform === "indie_hackers" || platform === "hacker_news") {
    generated = await generateFounderPost(startupInfo, platform, nextSlot)
    updates.generated_title = generated.title
    updates.generated_body  = generated.body
    updates.template_type   = generated.templateType

  } else if (platform === "devto" || platform === "hashnode" || platform === "medium") {
    generated = await generateBlogPost(startupInfo, platform, nextSlot)
    updates.generated_title = generated.title
    updates.generated_body  = generated.body
    updates.template_type   = generated.templateType

  } else {
    // Directory platforms
    generated = await generateDirectorySubmission(startupInfo, platform, nextSlot)
    updates.generated_title = generated.title
    updates.generated_body  = generated.body
    updates.template_type   = generated.templateType
  }

  const { error } = await supabase
    .from("daily_opportunities")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id) // defense-in-depth: always scope writes to verified owner

  if (error) {
    console.error("[regeneratePost] Update failed:", error.message)
    return null
  }

  return {
    ...generated,
    post_url: updates.post_url as string | undefined,
  }
}
