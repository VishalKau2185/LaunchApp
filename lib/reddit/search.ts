import { REDDIT_USER_AGENT } from "./auth"

export interface SubredditResult {
  name: string          // e.g. "startups"
  displayName: string   // e.g. "r/startups"
  url: string
  subscribers: number
  publicDescription: string
}

export async function searchSubreddits(keyword: string): Promise<SubredditResult[]> {
  try {
    const response = await fetch(
      `https://www.reddit.com/subreddits/search.json?q=${encodeURIComponent(keyword)}&limit=25`,
      {
        headers: {
          "User-Agent": REDDIT_USER_AGENT,
        },
      }
    )

    if (!response.ok) {
      console.error(`Reddit search failed for "${keyword}": ${response.status}`)
      return []
    }

    const data = await response.json()

    return (data.data?.children || [])
      .map((child: { data: { display_name: string; url: string; subscribers: number; public_description: string } }) => ({
        name: child.data.display_name,
        displayName: `r/${child.data.display_name}`,
        url: `https://reddit.com${child.data.url}`,
        subscribers: child.data.subscribers || 0,
        publicDescription: child.data.public_description || "",
      }))
      .filter((sr: SubredditResult) => sr.subscribers >= 1000)
  } catch (err) {
    console.error(`Search failed for keyword "${keyword}":`, err)
    return []
  }
}

export async function searchSubredditsForKeywords(keywords: string[]): Promise<SubredditResult[]> {
  const results = new Map<string, SubredditResult>()

  for (const keyword of keywords) {
    const srs = await searchSubreddits(keyword)
    for (const sr of srs) {
      if (!results.has(sr.name)) {
        results.set(sr.name, sr)
      }
    }
    // Be polite to Reddit's servers
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return Array.from(results.values())
}
