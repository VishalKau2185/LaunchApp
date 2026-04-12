import { NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { searchSubreddits } from "@/lib/reddit/search"
import { getSubredditRules, getRecentPostTitles } from "@/lib/reddit/rules"
import { classifyCommunity } from "@/lib/ai/classify-community"

const MIN_SUBSCRIBERS = 10000
const MAX_RESULTS_PER_QUERY = 10
const MAX_QUERIES = 8
const MIN_RELEVANCE_SCORE = 4    // lower threshold catches niche subs

/**
 * Pick targeted search queries from the startup's data.
 * Multi-word phrases are most specific — "event production" beats "production".
 */
function buildSearchQueries(
  keywords: string[],
  category: string | null,
  targetAudience: string | null,
): string[] {
  const seen = new Set<string>()
  const queries: string[] = []

  function add(q: string) {
    const t = q.trim()
    if (!t || seen.has(t.toLowerCase())) return
    seen.add(t.toLowerCase())
    queries.push(t)
  }

  // 1. Multi-word keyword phrases (most specific — find niche subs directly)
  for (const kw of keywords) {
    if (kw.trim().includes(" ")) add(kw.trim())
  }

  // 2. Target audience terms — each one is its own search
  if (targetAudience) {
    for (const part of targetAudience.split(/[,;]/)) {
      add(part.trim())
    }
  }

  // 3. Category
  if (category) add(category.trim())

  // 4. Single-word keywords
  for (const kw of keywords) {
    if (!kw.trim().includes(" ")) add(kw.trim())
  }

  // 5. Pairs of keywords (catches compound niche subs like r/beekeepingtools)
  for (let i = 0; i < Math.min(keywords.length, 4); i++) {
    for (let j = i + 1; j < Math.min(keywords.length, 4); j++) {
      add(`${keywords[i].trim()} ${keywords[j].trim()}`)
    }
  }

  return queries.slice(0, MAX_QUERIES)
}

/**
 * Score a subreddit for relevance to this startup.
 * Uses the same phrase-aware logic as the in-memory algorithm.
 * Returns 0 if the community is off-topic.
 */
function relevanceScore(
  subredditName: string,
  description: string,
  startupKeywords: string[],
  startupDescription: string,
  category: string | null,
  targetAudience: string | null,
): number {
  const STOP = new Set(["the","and","for","with","from","this","are","was","has","have","into","will","more","any","use","per","new","get","let","set","put","place"])

  const tokenize = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w))

  // Phrases from multi-word keywords
  const phrases = startupKeywords.filter((k) => k.includes(" ")).map((k) => k.toLowerCase().trim())

  // Standalone tokens — single-word keywords + desc words
  const phraseWords = new Set(phrases.flatMap((p) => p.split(/\s+/)))
  const singleKws = startupKeywords.filter((k) => !k.includes(" ")).map((k) => k.toLowerCase().trim())
  const descTokens = tokenize([category ?? "", targetAudience ?? "", startupDescription ?? ""].join(" "))
    .filter((w) => !phraseWords.has(w))
  const tokens = new Set([...singleKws, ...descTokens])

  // Score the subreddit name + its description against our phrases/tokens
  const targets = [subredditName.toLowerCase(), description.toLowerCase()]
  let score = 0

  for (const text of targets) {
    for (const phrase of phrases) {
      if (text.includes(phrase)) { score += 5; break }
    }
    for (const token of tokens) {
      if (token.length > 3 && text.includes(token)) score += 2
    }
  }

  return score
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!startup) return NextResponse.json({ error: "No startup found" }, { status: 404 })

  const admin = createAdminClient()
  const queries = buildSearchQueries(startup.keywords ?? [], startup.category, startup.target_audience)

  console.log(`[discover] Queries: ${queries.join(" | ")}`)

  const seenNames = new Set<string>()
  const discovered: { name: string; url: string; subscribers: number; description: string }[] = []

  for (const query of queries) {
    const results = await searchSubreddits(query)
    let added = 0

    for (const sr of results) {
      if (added >= MAX_RESULTS_PER_QUERY) break
      if (seenNames.has(sr.name.toLowerCase())) continue
      if (sr.subscribers < MIN_SUBSCRIBERS) continue

      seenNames.add(sr.name.toLowerCase())

      // Relevance gate — score subreddit name + description against startup data
      const relScore = relevanceScore(
        sr.name,
        sr.publicDescription,
        startup.keywords ?? [],
        startup.description ?? "",
        startup.category,
        startup.target_audience,
      )

      if (relScore < MIN_RELEVANCE_SCORE) {
        console.log(`[discover] skip r/${sr.name} — relevance=${relScore} (below threshold)`)
        continue
      }

      // Self-promo classification
      const [rules, posts] = await Promise.all([
        getSubredditRules(sr.name),
        getRecentPostTitles(sr.name),
      ])
      const cls = await classifyCommunity(sr.name, rules, posts)

      if (cls.self_promo_allowed && cls.confidence >= 0.6) {
        discovered.push({ name: sr.name, url: sr.url, subscribers: sr.subscribers, description: sr.publicDescription })
        added++
        console.log(`[discover] ✓ r/${sr.name} relevance=${relScore} confidence=${cls.confidence}`)
      } else {
        console.log(`[discover] ✗ r/${sr.name} self_promo=${cls.self_promo_allowed} confidence=${cls.confidence}`)
      }
    }

    if (queries.indexOf(query) < queries.length - 1) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }

  // Save relevant, approved communities to user_communities
  for (const sub of discovered) {
    const { data: comm } = await admin
      .from("communities")
      .upsert(
        {
          platform: "reddit" as const,
          name: sub.name,
          url: sub.url.endsWith("/") ? sub.url : `${sub.url}/`,
          members: sub.subscribers,
          self_promo_allowed: true,
          links_allowed: true,
          active: true,
          tags: [],
          quality_score: Math.min(5, Math.floor(sub.subscribers / 100000) + 2),
          activity_score: 3,
          rules_summary: sub.description.substring(0, 200),
        },
        { onConflict: "platform,name", ignoreDuplicates: false }
      )
      .select("id")
      .single()

    if (!comm) continue

    await admin
      .from("user_communities")
      .upsert(
        { user_id: user.id, community_id: comm.id, usage_count: 0 },
        { onConflict: "user_id,community_id", ignoreDuplicates: true }
      )
  }

  await admin.from("startups")
    .update({ discovery_status: "complete", updated_at: new Date().toISOString() })
    .eq("id", startup.id)
    .eq("user_id", user.id)

  const today = new Date().toISOString().split("T")[0]
  await admin.from("daily_opportunities").delete().eq("user_id", user.id).eq("date", today)

  return NextResponse.json({ discovered: discovered.length, queries })
}
