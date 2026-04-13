import { getAIClient } from "./client"
import { getTemplateForSlot, type TemplateType } from "@/lib/templates/post-templates"
import type { Platform } from "@/types/database"

interface StartupInfo {
  name: string
  description: string
  website: string | null
  keywords: string[]
  category?: string | null
  targetAudience?: string | null
}

interface GeneratedPost {
  title: string | null
  body: string
  templateType: TemplateType
}

const SYSTEM_PROMPT = `You write social media posts for startup founders.

Rules you must always follow:
- Sound like a real person, not a marketer
- Use first person singular ("I built", "I made", "I was frustrated")
- Keep it SHORT — 4 to 8 lines maximum for Reddit, shorter for Twitter
- No buzzwords: never say "revolutionary", "cutting-edge", "AI-powered", "game-changing", "seamlessly", "robust", "leverage", "utilize"
- No exclamation marks unless absolutely natural
- No long paragraphs — short sentences, line breaks
- Simple everyday language
- Slightly rough is better than too polished
- Never use "we" unless necessary
- Do not mention "ChatGPT" or other AI tools in the post
- Do not start with the company name in the title
- The post should feel like it came from a founder posting in their free time, not a marketing team`

export async function generateRedditPost(
  startup: StartupInfo,
  communityName: string,
  slotIndex: number,
  templateOverride?: TemplateType,
  postingNotes?: string,
): Promise<GeneratedPost> {
  const client = getAIClient()
  const template = templateOverride
    ? (require("@/lib/templates/post-templates").POST_TEMPLATES.find((t: { type: string }) => t.type === templateOverride) ?? getTemplateForSlot(slotIndex))
    : getTemplateForSlot(slotIndex)

  const communityGuidance = postingNotes
    ? `\nCommunity-specific guidance for r/${communityName}:\n${postingNotes}`
    : ""

  const prompt = `Write a Reddit post for r/${communityName} about this startup:

Name: ${startup.name}
Description: ${startup.description}
Website: ${startup.website || "none"}
Category: ${startup.category || "general"}
Target audience: ${startup.targetAudience || "general"}

Style to follow:
${template.redditStyle}
${communityGuidance}

Return only a JSON object with:
- "title": the post title (string)
- "body": the post body (string, use \\n for line breaks)

The body should be MAXIMUM 8 lines. Keep it short and natural. If there's a website, put it on its own line at the bottom of the body.`

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("No JSON found")

    const parsed = JSON.parse(jsonMatch[0])
    return {
      title: parsed.title || null,
      body: parsed.body || startup.description,
      templateType: template.type,
    }
  } catch {
    // Fallback
    return {
      title: `I built something to fix ${startup.keywords[0] || "a common problem"}`,
      body: `Been using ${startup.name} for a while now — built it because I kept running into the same issue.\n\nStill early but it's been helpful.\n\nWould love feedback if anyone wants to check it out.\n\n${startup.website || ""}`,
      templateType: template.type,
    }
  }
}

export async function generateTwitterPost(
  startup: StartupInfo,
  slotIndex: number
): Promise<GeneratedPost> {
  const client = getAIClient()
  const template = getTemplateForSlot(slotIndex)

  const prompt = `Write a Twitter/X post for this startup:

Name: ${startup.name}
Description: ${startup.description}
Website: ${startup.website || "none"}

Style to follow:
${template.twitterStyle}

Return only a JSON object with:
- "body": the tweet text including 2-3 hashtags (string, max 270 characters total)

Keep it under 270 characters. Casual founder tone. No exclamation marks.`

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("No JSON found")

    const parsed = JSON.parse(jsonMatch[0])
    let body = (parsed.body || "").substring(0, 270)

    return { title: null, body, templateType: template.type }
  } catch {
    const fallback = `Built ${startup.name} — ${startup.description.substring(0, 100)}. ${startup.website || ""} #startup #buildinpublic`
    return { title: null, body: fallback.substring(0, 270), templateType: template.type }
  }
}

export async function generateFounderPost(
  startup: StartupInfo,
  platform: "indie_hackers" | "hacker_news",
  slotIndex: number
): Promise<GeneratedPost> {
  const client = getAIClient()
  const template = getTemplateForSlot(slotIndex)

  const platformContext = platform === "hacker_news"
    ? "Hacker News (Show HN post — technical, direct, no marketing language)"
    : "Indie Hackers (founder community — slightly more personal, share the journey)"

  const prompt = `Write a post for ${platformContext} about this startup:

Name: ${startup.name}
Description: ${startup.description}
Website: ${startup.website || "none"}

Style to follow:
${template.founderStyle}

Return only a JSON object with:
- "title": post title (string) ${platform === "hacker_news" ? '— for HN use "Show HN: [name] – [one line description]"' : ""}
- "body": post body (string, use \\n for line breaks, max 10 lines)

Keep it natural and honest. No marketing language.`

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("No JSON found")

    const parsed = JSON.parse(jsonMatch[0])
    return {
      title: parsed.title || null,
      body: parsed.body || startup.description,
      templateType: template.type,
    }
  } catch {
    return {
      title: platform === "hacker_news" ? `Show HN: ${startup.name} – ${startup.description.substring(0, 60)}` : `Built ${startup.name}`,
      body: `${startup.description}\n\n${startup.website || ""}`,
      templateType: template.type,
    }
  }
}

export async function generateBlogPost(
  startup: StartupInfo,
  platform: "devto" | "hashnode" | "medium",
  slotIndex: number
): Promise<GeneratedPost> {
  const client = getAIClient()

  const platformContext = {
    devto: "dev.to — developer community. Technical, practical, story-driven. Readers are developers and indie hackers.",
    hashnode: "Hashnode — developer blog. Technical but accessible. Mix of tutorial and launch story style.",
    medium: "Medium — broad audience. More narrative, founder-journey focused. Less technical jargon.",
  }[platform]

  const prompt = `Write a blog post for ${platformContext}

Startup:
Name: ${startup.name}
Description: ${startup.description}
Website: ${startup.website || "none"}
Category: ${startup.category || "general"}
Target audience: ${startup.targetAudience || "general"}

Write a launch/founder story post. Structure:
- Hook: one honest line about the problem or backstory
- What it does: 2-3 sentences, simple and direct
- Why you built it: 1-2 personal sentences
- Call to action: one line inviting feedback or visits

Return only a JSON object with:
- "title": the blog post title (string, interesting and specific, not clickbait)
- "body": the post body (string, use \\n for line breaks, 15-25 lines, first person, natural tone)

No buzzwords. No marketing speak. Sound like a real founder writing at midnight.`

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("No JSON found")

    const parsed = JSON.parse(jsonMatch[0])
    return {
      title: parsed.title || `How I built ${startup.name}`,
      body: parsed.body || startup.description,
      templateType: "classic_i_built",
    }
  } catch {
    return {
      title: `How I built ${startup.name} to solve ${startup.keywords[0] || "a real problem"}`,
      body: `${startup.description}\n\nI built this because I kept running into the same frustration and couldn't find a good solution.\n\nStill early days but it's already helping.\n\n${startup.website || ""}`,
      templateType: "classic_i_built",
    }
  }
}

export async function generateDirectorySubmission(
  startup: StartupInfo,
  platform: string,
  slotIndex: number
): Promise<GeneratedPost> {
  const client = getAIClient()

  const prompt = `Write a product directory submission for ${startup.name}.

Startup:
Name: ${startup.name}
Description: ${startup.description}
Website: ${startup.website || "none"}
Category: ${startup.category || "general"}
Target audience: ${startup.targetAudience || "general"}

Return only a JSON object with:
- "title": a punchy product tagline (string, max 60 chars, no "The" or company name at start, no exclamation marks)
- "body": a short product description for a directory listing (string, 2-3 sentences, what it does, who it's for, why it's different — plain and direct)

No buzzwords. No "revolutionary". Just clear, honest product copy.`

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("No JSON found")

    const parsed = JSON.parse(jsonMatch[0])
    return {
      title: (parsed.title || startup.name).substring(0, 60),
      body: parsed.body || startup.description,
      templateType: "simple_utility",
    }
  } catch {
    return {
      title: `${startup.name} — ${startup.keywords[0] || "productivity"} tool`.substring(0, 60),
      body: `${startup.description} Built for ${startup.targetAudience || "anyone who needs it"}. ${startup.website || ""}`,
      templateType: "simple_utility",
    }
  }
}

export function buildTwitterIntentUrl(tweetText: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
}
