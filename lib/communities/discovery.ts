/**
 * Pure in-memory community discovery — no database writes.
 *
 * Scoring strategy:
 * - Multi-word keyword phrases (e.g. "lighting design") match as phrases only —
 *   their component words are NOT added to the standalone token pool.
 *   This prevents "design" from "lighting design" matching r/graphic_design.
 * - Single-word keywords and description words form the standalone token pool.
 * - Phrase match: 5 pts | Exact token: 4 pts | Partial token (len>4): 1 pt
 * - Startup/freelance communities get a small baseline bonus so they always appear
 *   even when the startup is in a niche with no seeded overlap.
 * - Guarantee ≥2 startup communities; rest earn their place via relevance.
 */
import { REDDIT_COMMUNITIES } from "./seed"
import type { SeededCommunity } from "./seed"

// ── Tokenisation ──────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "the","and","for","with","from","that","this","are","was","has","have",
  "its","our","your","their","all","one","can","not","but","also","into",
  "will","more","which","about","each","they","both","been","who","over",
  "any","use","per","new","get","let","set","put","all","place",
])

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
  )
}

/**
 * Build two distinct sets:
 * - phrases: multi-word keywords + 2/3-gram phrases from description text
 * - tokens: single-word keywords + description tokens,
 *           MINUS any word that only appears inside a multi-word keyword
 *           (so "design" from "lighting design" can't independently match)
 */
function buildMatchSets(
  keywords: string[],
  category: string | null,
  targetAudience: string | null,
  description: string | null,
): { phrases: string[]; tokens: Set<string> } {
  const multiWordKws: string[] = []
  const singleWordKws: string[] = []

  for (const kw of keywords) {
    const clean = kw.toLowerCase().trim()
    if (clean.includes(" ")) multiWordKws.push(clean)
    else if (clean.length > 2 && !STOP_WORDS.has(clean)) singleWordKws.push(clean)
  }

  // Words that belong exclusively to a multi-word keyword — exclude from standalone
  const phraseOnlyWords = new Set<string>()
  for (const mw of multiWordKws) {
    for (const word of mw.split(/\s+/)) {
      if (word.length > 2 && !STOP_WORDS.has(word)) {
        // Only exclude if this word doesn't also appear as its own single-word keyword
        if (!singleWordKws.includes(word)) phraseOnlyWords.add(word)
      }
    }
  }

  // Tokens: single-word keywords + category/audience/description words, minus phraseOnly
  const descText = [category ?? "", targetAudience ?? "", description ?? ""].join(" ")
  const descTokens = tokenize(descText)
  // Remove phrase-only words from description tokens too (they come from description context)
  for (const pw of phraseOnlyWords) descTokens.delete(pw)

  const tokens = new Set<string>([...singleWordKws, ...descTokens])

  // Phrases: multi-word keywords + 2-gram windows from description
  const phrases: string[] = [...multiWordKws]
  const descWords = descText.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w))
  for (let i = 0; i < descWords.length - 1; i++) {
    phrases.push(`${descWords[i]} ${descWords[i + 1]}`)
  }

  return { phrases, tokens }
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoreTag(tag: string, tokens: Set<string>, phrases: string[]): number {
  const lTag = tag.toLowerCase()

  // Phrase match — highest value (full keyword phrase hits the tag)
  for (const phrase of phrases) {
    if (lTag === phrase || lTag.includes(phrase) || phrase.includes(lTag)) return 5
  }

  // Exact standalone token match
  if (tokens.has(lTag)) return 4

  // Partial overlap — only meaningful length tokens to avoid noise
  for (const token of tokens) {
    if (token.length > 4 && (lTag.includes(token) || token.includes(lTag))) return 1
  }

  return 0
}

function scoreTagOverlap(tags: string[], tokens: Set<string>, phrases: string[]): number {
  let total = 0
  for (const tag of tags) total += scoreTag(tag, tokens, phrases)
  return total
}

interface ScoredCommunity {
  c: SeededCommunity
  tagScore: number
  total: number
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface SelectedCommunity {
  name: string
  url: string
}

/**
 * The best general startup/founder communities — always worth posting to regardless of niche.
 * These are your guaranteed reach for any product launch.
 */
const STATIC_FOUNDER_NAMES = [
  "SideProject", "startups", "SaaS", "indiehackers", "microsaas",
  "IMadeThis", "entrepreneur", "RoastMyStartup", "alphaandbetausers", "GrowthHacking",
]

export function selectStaticFounderCommunities(
  recentlyUsed: Set<string>,
  count = 4,
): SelectedCommunity[] {
  const pool = REDDIT_COMMUNITIES.filter(
    (c) => STATIC_FOUNDER_NAMES.includes(c.name) && c.self_promo_allowed
  ).sort((a, b) => (b.quality_score + b.activity_score) - (a.quality_score + a.activity_score))

  // Fresh first, then recently used
  const fresh  = pool.filter((c) => !recentlyUsed.has(c.name.toLowerCase()))
  const recent = pool.filter((c) =>  recentlyUsed.has(c.name.toLowerCase()))

  return [...fresh, ...recent].slice(0, count).map((c) => ({ name: c.name, url: c.url }))
}

export function selectRedditCommunities(
  keywords: string[],
  category: string | null,
  targetAudience: string | null,
  description: string | null,
  recentlyUsed: Set<string>,
  count = 8,
): SelectedCommunity[] {
  const { phrases, tokens } = buildMatchSets(keywords, category, targetAudience, description)

  // Score every eligible community
  const all: ScoredCommunity[] = REDDIT_COMMUNITIES
    .filter((c) => c.self_promo_allowed)
    .map((c) => {
      const tagScore = scoreTagOverlap(c.tags, tokens, phrases)
      const isFounderVertical = c.vertical === "startup" || c.vertical === "freelance"
      const verticalBonus = isFounderVertical ? 4 : 0
      const qualityBonus  = c.quality_score + c.activity_score
      return {
        c,
        tagScore,
        total: tagScore * 3 + qualityBonus + verticalBonus,
      }
    })
    .filter(({ total }) => total > 0)
    .sort((a, b) => b.total - a.total)

  const isRecent = (s: ScoredCommunity) => recentlyUsed.has(s.c.name.toLowerCase())

  // Split into fresh (not used recently) and stale (used in last 14 days)
  const fresh = all.filter((s) => !isRecent(s))
  const stale = all.filter((s) =>  isRecent(s))

  const isFounderVertical = (s: ScoredCommunity) => ["startup","freelance"].includes(s.c.vertical)

  // From fresh pool: niche subs (tagScore >= 6) + at least 2 startup subs
  const freshNiche   = fresh.filter((s) => !isFounderVertical(s) && s.tagScore >= 6)
  const freshStartup = fresh.filter((s) =>  isFounderVertical(s))

  // From stale pool (fallback): same split
  const staleNiche   = stale.filter((s) => !isFounderVertical(s) && s.tagScore >= 6)
  const staleStartup = stale.filter((s) =>  isFounderVertical(s))

  const seen = new Set<string>()
  const combined: ScoredCommunity[] = []

  function add(s: ScoredCommunity) {
    if (!seen.has(s.c.name)) { seen.add(s.c.name); combined.push(s) }
  }

  // 1. Fill niche slots from fresh pool first (up to count-2)
  freshNiche.slice(0, count - 2).forEach(add)

  // 2. Guarantee 2 startup subs — prefer fresh, fall back to stale
  let startupAdded = 0
  for (const s of [...freshStartup, ...staleStartup]) {
    if (startupAdded >= 2) break
    add(s); startupAdded++
  }

  // 3. Fill remaining slots — fresh first, then stale as last resort
  for (const s of [...fresh, ...stale]) {
    if (combined.length >= count) break
    add(s)
  }

  return combined.slice(0, count).map((s) => ({ name: s.c.name, url: s.c.url }))
}
