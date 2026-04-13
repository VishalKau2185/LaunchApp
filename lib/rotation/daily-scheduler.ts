import { createClient, createAdminClient } from "@/lib/supabase/server"
import { selectRedditCommunities } from "@/lib/communities/discovery"
import {
  generateRedditPost,
  generateTwitterPost,
  generateFounderPost,
  generateBlogPost,
  generateDirectorySubmission,
  buildTwitterIntentUrl,
} from "@/lib/ai/generate-post"
import type { OpportunityWithCommunity, Platform } from "@/types/database"

// ── Platform rotation (daily) ─────────────────────────────────────────────────

const FOUNDER_PLATFORMS = ["indie_hackers", "hacker_news"] as const
const BLOG_PLATFORMS    = ["devto", "hashnode", "medium"] as const

function dayIndex(dateStr?: string) {
  if (dateStr) return Math.floor(new Date(dateStr).getTime() / 86400000)
  return Math.floor(Date.now() / 86400000)
}
function founderPlatform(dateStr?: string) { return FOUNDER_PLATFORMS[dayIndex(dateStr) % 2] }
function blogPlatform(dateStr?: string)    { return BLOG_PLATFORMS[dayIndex(dateStr) % 3] }

// ── Platform metadata ─────────────────────────────────────────────────────────

const FOUNDER_URLS: Record<string, string> = {
  indie_hackers: "https://www.indiehackers.com/post",
  hacker_news:   "https://news.ycombinator.com/submit",
}

const BLOG_URLS: Record<string, string> = {
  devto:    "https://dev.to/new",
  hashnode: "https://hashnode.com/create/story",
  medium:   "https://medium.com/new-story",
}

const BLOG_REASONS: Record<string, string> = {
  devto:    "dev.to reaches 1M+ developers — great for technical products",
  hashnode: "Hashnode developer community for launch stories",
  medium:   "Medium reaches founders and early adopters broadly",
}

const DIR_PLATFORMS: { platform: Platform; url: string; name: string; reason: string }[] = [
  { platform: "product_hunt",   url: "https://www.producthunt.com/posts/new",    name: "Product Hunt",   reason: "Product Hunt surfaces new products to thousands of early adopters daily" },
  { platform: "betalist",       url: "https://betalist.com/submit",              name: "BetaList",       reason: "BetaList connects early-stage products with beta testers" },
  { platform: "uneed",          url: "https://www.uneed.best/submit-a-tool",     name: "Uneed",          reason: "Uneed is a curated directory of useful tools" },
  { platform: "microlaunch",    url: "https://microlaunch.net/submit",           name: "MicroLaunch",    reason: "MicroLaunch specialises in micro-SaaS and indie products" },
  { platform: "launching_next", url: "https://www.launchingnext.com/submit/",   name: "LaunchingNext",  reason: "LaunchingNext features upcoming startups for early adopters" },
  { platform: "sideprojectors", url: "https://www.sideprojectors.com/",         name: "SideProjectors", reason: "SideProjectors is a community for indie makers" },
  { platform: "peerlist",       url: "https://peerlist.io/",                     name: "Peerlist",       reason: "Peerlist is a professional network for builders and developers" },
]

// ── Reddit URL builder (auto-fills title + body) ──────────────────────────────

function redditSubmitUrl(communityUrl: string, title: string, body: string): string {
  const base = communityUrl.endsWith("/") ? communityUrl : `${communityUrl}/`
  return `${base}submit?${new URLSearchParams({ title: title.substring(0, 300), text: body.substring(0, 10000) })}`
}

// ── Extract subreddit name from a Reddit URL ──────────────────────────────────

export function subredditFromUrl(url: string): string | null {
  const m = url.match(/reddit\.com\/r\/([^/?#]+)/)
  return m ? m[1] : null
}

// ── Recently used subreddits (for rotation) ───────────────────────────────────

async function recentSubreddits(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<Set<string>> {
  const since = new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0]
  const { data } = await supabase
    .from("daily_opportunities")
    .select("post_url")
    .eq("user_id", userId)
    .eq("platform", "reddit")
    .gte("date", since)

  const names = new Set<string>()
  for (const row of data ?? []) {
    const name = subredditFromUrl(row.post_url)
    if (name) names.add(name.toLowerCase())
  }
  return names
}

// ── Insert helpers ────────────────────────────────────────────────────────────

type InsertRow = {
  user_id: string
  date: string
  platform: Platform
  community_id: null
  post_url: string
  generated_title: string | null
  generated_body: string
  template_type: string
  slot_index: number
  match_reason?: string | null
}

/** Insert rows using the admin client (bypasses RLS — safe since userId is verified
    by the caller). Falls back to base platforms if the extended constraint isn't applied. */
async function insertOpportunities(rows: InsertRow[]): Promise<InsertRow[]> {
  // Admin client bypasses RLS entirely — no session expiry issues
  const admin = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tryInsert = async (data: any[]) =>
    admin.from("daily_opportunities").insert(data).select("*").order("slot_index", { ascending: true })

  // Attempt 1: full rows with match_reason
  let { data, error } = await tryInsert(rows)

  if (error) {
    console.error("[scheduler] Insert attempt 1 failed:", error.message, error.code)
    // Attempt 2: strip match_reason (column may not exist before migration 006)
    const noReason = rows.map(({ match_reason: _r, ...rest }) => rest);
    ({ data, error } = await tryInsert(noReason))
  }

  if (error) {
    console.error("[scheduler] Insert attempt 2 failed:", error.message, error.code)
    // Attempt 3: base platforms only (reddit/twitter/ih/hn always valid)
    const BASE = new Set(["reddit", "twitter", "indie_hackers", "hacker_news"])
    const baseOnly = rows
      .filter((r) => BASE.has(r.platform))
      .map(({ match_reason: _r, ...rest }) => rest);
    ({ data, error } = await tryInsert(baseOnly))
  }

  if (error) {
    console.error("[scheduler] All insert attempts failed:", error.message, error.code, error.details)
    return []
  }

  return (data ?? []) as unknown as InsertRow[]
}

// ── Schedule preview (no DB, pure computation) ────────────────────────────────

export interface DaySchedule {
  dayIndex: number
  date: string
  founderPlatform: string
  founderLabel: string
  founderUrl: string
  blogPlatform: string
  blogLabel: string
  blogUrl: string
  directories: { name: string; url: string; platform: string }[]
}

const FOUNDER_LABELS: Record<string, string> = { indie_hackers: "Indie Hackers", hacker_news: "Hacker News" }
const BLOG_LABELS: Record<string, string>    = { devto: "dev.to", hashnode: "Hashnode", medium: "Medium" }

export function getScheduleInfo(dayOffset = 0): DaySchedule {
  const idx = dayIndex() + dayOffset
  const date = new Date(idx * 86400000).toISOString().split("T")[0]
  const fp   = FOUNDER_PLATFORMS[idx % FOUNDER_PLATFORMS.length]
  const bp   = BLOG_PLATFORMS[idx % BLOG_PLATFORMS.length]
  const dirOffset = idx % DIR_PLATFORMS.length
  return {
    dayIndex: idx,
    date,
    founderPlatform: fp,
    founderLabel: FOUNDER_LABELS[fp],
    founderUrl: FOUNDER_URLS[fp],
    blogPlatform: bp,
    blogLabel: BLOG_LABELS[bp],
    blogUrl: BLOG_URLS[bp],
    directories: [
      { name: DIR_PLATFORMS[dirOffset % DIR_PLATFORMS.length].name, url: DIR_PLATFORMS[dirOffset % DIR_PLATFORMS.length].url, platform: DIR_PLATFORMS[dirOffset % DIR_PLATFORMS.length].platform },
      { name: DIR_PLATFORMS[(dirOffset + 1) % DIR_PLATFORMS.length].name, url: DIR_PLATFORMS[(dirOffset + 1) % DIR_PLATFORMS.length].url, platform: DIR_PLATFORMS[(dirOffset + 1) % DIR_PLATFORMS.length].platform },
    ],
  }
}

// ── Main scheduler ────────────────────────────────────────────────────────────

export async function getTodaysOpportunities(userId: string, dateOverride?: string): Promise<OpportunityWithCommunity[]> {
  const supabase = await createClient()
  const today = dateOverride ?? new Date().toISOString().split("T")[0]

  // Return cached opportunities for today
  const { data: existing } = await supabase
    .from("daily_opportunities")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .order("slot_index", { ascending: true })

  if (existing && existing.length > 0) {
    return existing as unknown as OpportunityWithCommunity[]
  }

  // Get startup
  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (!startup || startup.discovery_status !== "complete") return []

  const startupInfo = {
    name:           startup.name,
    description:    startup.description,
    website:        startup.website,
    keywords:       startup.keywords ?? [],
    category:       startup.category,
    targetAudience: startup.target_audience,
  }

  // Get recently used subreddits for rotation
  const usedSubreddits = await recentSubreddits(supabase, userId)

  // ── Hybrid community selection ─────────────────────────────────────────────
  // Primary: in-memory scored selection (proven correct, always relevant)
  // Supplement: dynamic communities from Reddit API search that also pass
  //             the in-memory relevance filter (filters out off-topic results)

  type CommunityRef = { name: string; url: string; postingNotes?: string }

  // In-memory selection — the authoritative, relevance-scored pool
  const scored = selectRedditCommunities(
    startupInfo.keywords,
    startupInfo.category,
    startupInfo.targetAudience,
    startupInfo.description,
    usedSubreddits,
    8
  )

  // Supplement: fetch dynamic communities saved by /api/discover,
  // but only use ones that also appear in the scored set OR score well via name overlap
  const { data: cachedRows } = await supabase
    .from("user_communities")
    .select("communities(name, url)")
    .eq("user_id", userId)
    .order("usage_count", { ascending: true })
    .limit(50)

  // Dynamic niche communities from discovery (sorted least-used first = most rotation)
  const nicheDiscovered: CommunityRef[] = (cachedRows ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((r) => r.communities as any as CommunityRef | null)
    .filter((c): c is CommunityRef => !!(c?.name && c?.url))

  // Strategy: 3 guaranteed startup seed subs + up to 5 niche subs from discovery.
  // If fewer than 5 niche subs exist, fill the remaining slots from seed.
  const STARTUP_SUBS = new Set(["SideProject","IMadeThis","startups","indiehackers","SaaS","microsaas","entrepreneur","Entrepreneur"])
  const startupSeeds = scored.filter((c) => STARTUP_SUBS.has(c.name)).slice(0, 3)

  const startupSeedNames = new Set(startupSeeds.map((c) => c.name.toLowerCase()))

  const seen = new Set<string>([...startupSeedNames])
  const merged: CommunityRef[] = [...startupSeeds]

  // Fill with niche discovered subs (avoiding duplicates with startup seeds)
  for (const c of nicheDiscovered) {
    if (merged.length >= 8) break
    if (!seen.has(c.name.toLowerCase())) {
      seen.add(c.name.toLowerCase())
      merged.push(c)
    }
  }

  // Fill any remaining slots with the rest of the scored seed list
  for (const c of scored) {
    if (merged.length >= 8) break
    if (!seen.has(c.name.toLowerCase())) {
      seen.add(c.name.toLowerCase())
      merged.push(c)
    }
  }

  const redditCommunities: CommunityRef[] = merged.slice(0, 8)

  const rows: InsertRow[] = []

  try {
    // ── Slots 0–7: Reddit ───────────────────────────────────────────────────
    for (let i = 0; i < redditCommunities.length; i++) {
      const { name, url, postingNotes } = redditCommunities[i]
      const post = await generateRedditPost(startupInfo, name, i, undefined, postingNotes)
      rows.push({
        user_id: userId, date: today, platform: "reddit", community_id: null,
        post_url: post.title ? redditSubmitUrl(url, post.title, post.body) : `${url}submit`,
        generated_title: post.title,
        generated_body:  post.body,
        template_type:   post.templateType,
        slot_index: i,
        match_reason: null,
      })
    }

    // ── Slots 8–9: Twitter ──────────────────────────────────────────────────
    for (let t = 0; t < 2; t++) {
      const post = await generateTwitterPost(startupInfo, 8 + t)
      rows.push({
        user_id: userId, date: today, platform: "twitter", community_id: null,
        post_url: buildTwitterIntentUrl(post.body),
        generated_title: null,
        generated_body:  post.body,
        template_type:   post.templateType,
        slot_index: 8 + t,
        match_reason: null,
      })
    }

    // ── Slot 10: Founder platform (alternates daily) ────────────────────────
    const fp = founderPlatform(today)
    const founderPost = await generateFounderPost(startupInfo, fp, 10)
    rows.push({
      user_id: userId, date: today, platform: fp as Platform, community_id: null,
      post_url: FOUNDER_URLS[fp],
      generated_title: founderPost.title,
      generated_body:  founderPost.body,
      template_type:   founderPost.templateType,
      slot_index: 10,
      match_reason: fp === "hacker_news"
        ? "Show HN reaches thousands of tech founders and developers"
        : "Indie Hackers is where bootstrapped founders share and grow",
    })

    // ── Slot 11: Blog (rotates daily) ───────────────────────────────────────
    const bp = blogPlatform(today)
    const blogPost = await generateBlogPost(startupInfo, bp, 11)
    rows.push({
      user_id: userId, date: today, platform: bp as Platform, community_id: null,
      post_url: BLOG_URLS[bp],
      generated_title: blogPost.title,
      generated_body:  blogPost.body,
      template_type:   blogPost.templateType,
      slot_index: 11,
      match_reason: BLOG_REASONS[bp],
    })

    // ── Slots 12–13: Directories ────────────────────────────────────────────
    const dirOffset = dayIndex(today) % DIR_PLATFORMS.length
    for (let d = 0; d < 2; d++) {
      const dir = DIR_PLATFORMS[(dirOffset + d) % DIR_PLATFORMS.length]
      const dirPost = await generateDirectorySubmission(startupInfo, dir.platform, 12 + d)
      rows.push({
        user_id: userId, date: today, platform: dir.platform, community_id: null,
        post_url: dir.url,
        generated_title: dirPost.title,
        generated_body:  dirPost.body,
        template_type:   dirPost.templateType,
        slot_index: 12 + d,
        match_reason: dir.reason,
      })
    }
  } catch (err) {
    console.error("[scheduler] Generation error:", err)
    // If we have at least some rows, proceed with what we built
    if (rows.length === 0) return []
  }

  // ── Dedup check (concurrent requests) ──────────────────────────────────────
  const admin = createAdminClient()
  const { data: raceCheck } = await admin
    .from("daily_opportunities").select("id").eq("user_id", userId).eq("date", today).limit(1)
  if (raceCheck && raceCheck.length > 0) {
    const { data: existingRace } = await admin
      .from("daily_opportunities").select("*").eq("user_id", userId).eq("date", today).order("slot_index", { ascending: true })
    return (existingRace ?? []) as unknown as OpportunityWithCommunity[]
  }

  const inserted = await insertOpportunities(rows)
  return inserted as unknown as OpportunityWithCommunity[]
}
