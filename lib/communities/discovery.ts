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

// ── Whitelist approach: ONLY these communities are eligible ──────────────────
// Every community here has been verified to:
//   1. Explicitly allow self-promotion and external links
//   2. Not require karma minimums or mod verification to post
//   3. Have a community culture welcoming to founders sharing products
//
// This is intentionally conservative. It is better to miss a community
// than to send users somewhere that will get their post removed.
const VERIFIED_SUBS = new Set([
  // ── PURPOSE-BUILT FOR SHARING PROJECTS (truly karma-free, always works) ──
  "SideProject",        // Literally made for side projects. No karma gate.
  "IMadeThis",          // Literally made for sharing things you built. No karma gate.
  "alphaandbetausers",  // Made for finding beta testers. No karma gate.
  "RoastMyStartup",     // Made for startup feedback. No karma gate.
  "Entrepreneur_Feedback", // Made for product/idea feedback. No karma gate.
  "microsaas",          // Micro-SaaS founders, no karma gate.
  "indiehackers",       // Indie hacker community, no karma gate.
  "SaaS",               // SaaS founders, no karma gate.
  "startupideas",       // Open to sharing and validating ideas. No karma gate.
  "nocode",             // No-code tools, explicitly welcoming. No karma gate.

  // ── TECH (topic-open, welcoming to dev tools of any kind) ────────────────
  "webdev",             // Showoff Saturday culture. Any web tool welcome.
  "selfhosted",         // Explicitly welcoming to new self-hosted tools.
  "opensource",         // Open source projects welcome.

  // ── AI / TOOLS ────────────────────────────────────────────────────────────
  "artificial",         // AI tools welcome, welcoming community.
  "LocalLLaMA",         // Very welcoming to local/open AI tools.
  "PromptEngineering",  // Prompt and AI tools welcome.

  // ── PRODUCTIVITY ──────────────────────────────────────────────────────────
  "productivity",       // Tools welcome with substance.
  "Notion",             // Notion tools and templates explicitly welcome.
  "ObsidianMD",         // Plugins and tools explicitly welcome.

  // ── CREATOR ECONOMY ───────────────────────────────────────────────────────
  "NewTubers",          // YouTube creator tools explicitly welcome.
  "podcasting",         // Podcasting tools explicitly welcome.
  "newsletters",        // Newsletter tools welcome, small community.
  "blogging",           // Blogging tools welcome.
  "Creator_Economy",    // Creator tools and products welcome.

  // ── MUSIC / AUDIO ─────────────────────────────────────────────────────────
  "WeAreTheMusicMakers", // Very welcoming to music production tools.
  "audioengineering",   // Audio tools and plugins welcome.
  "edmproduction",      // EDM tools welcome.
  "makinghiphop",       // Beat-making tools welcome.
  "synthesizers",       // Synth tools and plugins welcome.

  // ── GAMING (feedback culture, welcoming) ──────────────────────────────────
  "gamedev",            // Feedback Friday — any game/tool welcome.
  "indiegaming",        // Indie games and tools explicitly welcome.
  "indiegames",         // Share your indie project directly.

  // ── FITNESS (tool-friendly communities) ───────────────────────────────────
  "running",            // Running apps welcome.
  "yoga",               // Yoga apps welcome.
  "cycling",            // Cycling apps welcome.
  "Meditation",         // Meditation apps welcome.

  // ── EDUCATION ─────────────────────────────────────────────────────────────
  "languagelearning",   // Language learning tools very welcome.
  "edtech",             // EdTech products explicitly welcome.
  "GetStudying",        // Study tools welcome.
  "Anki",               // Anki tools and addons explicitly welcome.

  // ── REMOTE WORK / FREELANCE ───────────────────────────────────────────────
  "digitalnomad",       // Remote work tools welcome.
  "freelance",          // Freelance tools welcome.
  "remotework",         // Remote work tools welcome.
  "WorkOnline",         // Online work platforms welcome.

  // ── FINANCE / COMMERCE ────────────────────────────────────────────────────
  "fintech",            // Fintech products welcome.
  "ecommerce",          // Ecommerce tools welcome.
  "shopify",            // Shopify apps explicitly welcome.
  "Etsy",               // Etsy seller tools welcome.
  "AmazonSeller",       // Amazon seller tools welcome.
  "realestateinvesting",// Real estate tools welcome.
  "landlord",           // Property management tools welcome.
  "accounting",         // Accounting tools welcome.
  "humanresources",     // HR tools welcome.

  // ── DESIGN ────────────────────────────────────────────────────────────────
  "web_design",         // Web design tools welcome.
  "UI_Design",          // UI tools and showcases welcome.
  "userexperience",     // UX tools welcome.
  "Figma",              // Figma plugins and tools explicitly welcome.
  "branding",           // Branding tools welcome.

  // ── VIDEO / PHOTO ─────────────────────────────────────────────────────────
  "videography",        // Video tools welcome.
  "videoproduction",    // Video production tools welcome.
  "Filmmakers",         // Film tools welcome.
  "cinematography",     // Cinematography tools welcome.

  // ── EVENTS / PRODUCTION ───────────────────────────────────────────────────
  "EventProduction",    // Event production tools welcome.
  "eventplanning",      // Event planning tools welcome.
  "livesound",          // Live sound tools welcome.
  "weddingplanning",    // Wedding planning tools welcome.

  // ── MARKETING (welcoming, lower karma gates than SEO/PPC) ─────────────────
  "content_marketing",  // Content tools welcome.
  "emailmarketing",     // Email tools welcome.
  "socialmedia",        // Social media tools welcome.
  "copywriting",        // Copywriting tools welcome.
])

// ── Community-specific posting guidance ───────────────────────────────────────
// Tells the AI exactly HOW to frame the post for that specific community.
// Without this, posts sound generic and get removed for not fitting the culture.
const POSTING_NOTES: Record<string, string> = {
  // Tech showcase subs — frame as "I built X", technical angle
  "webdev":      "Frame as a project showcase: 'I built X' opener, invite feedback, keep it technical and honest.",
  "Python":      "Lead with what the tool does technically. Title like 'I built a Python tool that...' works well here.",
  "nextjs":      "Frame as a Next.js build post. Mention architecture or interesting technical decisions.",
  "reactjs":     "Frame as a React project showcase. Mention tech choices and invite critique.",
  "typescript":  "Focus on the developer experience or type safety angle. Community appreciates technical depth.",
  "node":        "Lead with a technical problem solved. 'I built a Node.js tool that...' framing.",
  "golang":      "Focus on performance or simplicity angle. Go community appreciates no-bloat tools.",
  "rust":        "Emphasize safety, performance, or memory efficiency. Rust community respects technical rigour.",
  "django":      "Lead with the backend problem it solves. Django community likes pragmatic tools.",
  "flask":       "Frame as a lightweight tool built with Flask. Keep it simple and focused.",
  "vuejs":       "Frame as a Vue.js project. Mention component design or DX improvements.",
  "sveltejs":    "Focus on how Svelte made the build better. Community appreciates the 'less framework' angle.",
  "devops":      "Frame around the ops problem it solves. Metrics, reliability, or automation angle.",
  "aws":         "Frame around the AWS problem it solves — scaling, cost, or automation.",
  "selfhosted":  "Lead with privacy and self-hosting benefits. Community loves 'alternative to X' framing.",
  "opensource":  "Emphasize open source nature, license, and contribution welcome angle.",
  // Startup subs — be a founder, not a marketer
  "SideProject":         "Be direct — this community is made for sharing side projects. Show what you built and why.",
  "startups":            "Share as a founder post: the problem, your solution, what you learned. Not a sales pitch.",
  "indiehackers":        "Share revenue, traction, or the honest founder journey. Numbers and transparency do well.",
  "microsaas":           "Share the micro-SaaS angle: solo-built, specific problem, early MRR or users.",
  "SaaS":                "Frame around the SaaS business model or problem being solved for B2B customers.",
  "RoastMyStartup":      "Ask for brutally honest critical feedback. Name real weaknesses — the community rewards vulnerability.",
  "alphaandbetausers":   "Lead with exactly what you need testers for. Make the sign-up link front and centre.",
  "Entrepreneur_Feedback":"Ask a specific question and invite constructive critique. Pure promotion gets ignored.",
  "entrepreneur":        "Share the founder story or business lesson. Value-first, product second.",
  "Entrepreneur":        "Frame as a business insight or journey post. The community rewards substance over pitching.",
  "GrowthHacking":       "Lead with a specific growth tactic or result. Tool as the mechanism, not the headline.",
  "nocode":              "Highlight the no-code build process. Community loves 'built this without writing a line of code' angle.",
  // Gaming — feedback is the culture
  "gamedev":     "Use Feedback Friday framing. Describe what you built and ask for specific critique.",
  "indiegaming": "Show the game or tool directly. Screenshots and GIFs outperform text-only posts.",
  "indiegames":  "Post directly — community loves early indie projects. Include visuals if possible.",
  "Unity3D":     "Lead with the Unity-specific problem solved or technique used.",
  "godot":       "Frame around the Godot implementation. Community appreciates open-source commitment.",
  "gamedesign":  "Focus on design mechanics or problems solved, not the product. Invite design discussion.",
  // Creators — authentic story, not pitch
  "NewTubers":    "Frame around the YouTube growth problem it solves. Creator-to-creator tone.",
  "podcasting":   "Frame around the podcasting workflow problem it solves. Practical and direct.",
  "newsletters":  "Share the newsletter growth or creation problem it solves. Community loves specifics.",
  "blogging":     "Frame around the blogging workflow improvement. Show before/after if possible.",
  "Creator_Economy": "Connect to monetisation or audience-building problem. Creator-first framing.",
  // Fitness — practical tool, not ad
  "running":  "Frame around a real running problem the tool solves. Personal story works well.",
  "yoga":     "Connect to the practice first, tool second. Community appreciates authenticity over promotion.",
  "cycling":  "Frame around a training or route problem solved. Community is gear-enthusiast friendly.",
  "swimming": "Frame around a lap tracking or training problem. Practical and direct.",
  "Meditation":"Focus on the mindfulness benefit, not the app features. Calm, grounded tone.",
  // Education
  "languagelearning": "Frame around the language learning problem it solves. Community loves specific languages.",
  "edtech":     "Frame as a founder building for education. Share the teaching problem you solved.",
  "GetStudying": "Frame around a specific studying workflow problem. Students appreciate practical tools.",
  "Anki":       "If it integrates with or improves Anki, lead with that. Community is very tool-specific.",
  // Remote/freelance
  "digitalnomad": "Frame around the remote work or travel-while-working problem it solves.",
  "freelance":    "Frame around a freelancer pain point: invoicing, clients, contracts, time tracking.",
  "remotework":   "Frame around async collaboration or remote team problem it solves.",
  "WorkOnline":   "Frame around a specific online income or work problem it solves.",
  // Marketing
  "digital_marketing": "Lead with a specific marketing result or problem. Data and case studies do well.",
  "SEO":          "Frame around a specific SEO problem or workflow improvement. Community is technical.",
  "growthhacking":"Lead with a specific growth result or tactic. Tool as the mechanism.",
  "content_marketing": "Frame around a content workflow or distribution problem. Practical and specific.",
  "emailmarketing": "Frame around a deliverability, growth, or automation problem it solves.",
  "socialmedia":  "Frame around a specific social media workflow or growth problem.",
  "copywriting":  "Frame around a copywriting workflow improvement. Community appreciates good copy in the post itself.",
  "PPC":          "Frame around a specific paid ads problem: ROAS, automation, or reporting.",
  // Finance/commerce
  "fintech":         "Frame as a fintech founder solving a specific financial problem. B2B angle works well.",
  "ecommerce":       "Frame around a specific ecommerce problem: conversion, fulfilment, or operations.",
  "shopify":         "Frame around a specific Shopify seller problem. The community is very practical.",
  "Etsy":            "Frame around an Etsy seller problem — listing, shipping, or customer management.",
  "AmazonSeller":    "Frame around a specific Amazon FBA or selling problem.",
  "realestateinvesting": "Frame around a specific real estate analysis or deal-finding problem.",
  "landlord":        "Frame around a specific landlord management problem: tenants, maintenance, or accounting.",
  "accounting":      "Frame around a specific accounting workflow problem for small businesses.",
  "humanresources":  "Frame around a specific HR pain point: hiring, onboarding, or compliance.",
  // Design
  "web_design":    "Frame as a design showcase or tool that solves a specific web design problem.",
  "UI_Design":     "Frame as a UI showcase or tool. Include screenshots if possible.",
  "userexperience":"Frame around a UX research or usability problem. Community appreciates methodology.",
  "Figma":         "Frame around a Figma workflow, plugin, or design system problem it solves.",
  "branding":      "Frame around a brand identity or visual consistency problem.",
  // Music
  "WeAreTheMusicMakers": "Frame as a music production tool. Community loves workflow improvements.",
  "audioengineering":    "Frame around a specific audio problem: mixing, mastering, or recording workflow.",
  "edmproduction":       "Frame around an EDM production workflow problem. Practical and tool-focused.",
  "makinghiphop":        "Frame around a beat-making or production workflow improvement.",
  "Guitar":              "Frame around a specific guitar learning or practice problem it solves.",
  "synthesizers":        "Frame around a synthesis or sound design workflow improvement.",
  // Events
  "EventProduction":  "Frame around a specific event production workflow problem.",
  "eventplanning":    "Frame around a specific event planning or coordination problem it solves.",
  "weddingplanning":  "Frame around a specific wedding planning pain point.",
  "Filmmakers":       "Frame around a specific filmmaking workflow or production problem.",
  "cinematography":   "Frame around a specific camera, lighting, or DOP workflow problem.",
  "livesound":        "Frame around a live sound or PA system workflow problem.",
  "videoproduction":  "Frame around a video production workflow problem.",
  // Productivity
  "productivity":  "Frame around a specific workflow or time management problem. Personal story works well.",
  "Notion":        "Frame as a Notion workflow or template. The community loves practical implementations.",
  "ObsidianMD":    "Frame around an Obsidian plugin, workflow, or PKM improvement.",
}

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
  postingNotes?: string
}

/**
 * The best general startup/founder communities — always worth posting to regardless of niche.
 * These are your guaranteed reach for any product launch.
 */
const STATIC_FOUNDER_NAMES = [
  "SideProject", "SaaS", "indiehackers", "microsaas",
  "IMadeThis", "RoastMyStartup", "alphaandbetausers", "startupideas", "nocode",
]

export function selectStaticFounderCommunities(
  recentlyUsed: Set<string>,
  count = 4,
): SelectedCommunity[] {
  const pool = REDDIT_COMMUNITIES.filter(
    (c) => STATIC_FOUNDER_NAMES.includes(c.name) && c.self_promo_allowed && c.links_allowed && VERIFIED_SUBS.has(c.name)
  ).sort((a, b) => (b.quality_score + b.activity_score) - (a.quality_score + a.activity_score))

  // Fresh first, then recently used
  const fresh  = pool.filter((c) => !recentlyUsed.has(c.name.toLowerCase()))
  const recent = pool.filter((c) =>  recentlyUsed.has(c.name.toLowerCase()))

  return [...fresh, ...recent].slice(0, count).map((c) => ({ name: c.name, url: c.url, postingNotes: POSTING_NOTES[c.name] }))
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
    .filter((c) => c.self_promo_allowed && c.links_allowed && VERIFIED_SUBS.has(c.name))
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

  // 1. Guarantee 3 startup/founder subs first (general reach for any product)
  // These are the communities every founder should post to regardless of niche.
  let startupAdded = 0
  for (const s of [...freshStartup, ...staleStartup]) {
    if (startupAdded >= 3) break
    add(s); startupAdded++
  }

  // 2. Fill remaining slots with niche subs (tagScore >= 6 = strong relevance match)
  freshNiche.slice(0, count - 3).forEach(add)

  // 3. Fill remaining slots — fresh first, then stale as last resort
  for (const s of [...fresh, ...stale]) {
    if (combined.length >= count) break
    add(s)
  }

  return combined.slice(0, count).map((s) => ({ name: s.c.name, url: s.c.url, postingNotes: POSTING_NOTES[s.c.name] }))
}
