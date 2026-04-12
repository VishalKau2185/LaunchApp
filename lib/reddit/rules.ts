import { REDDIT_USER_AGENT } from "./auth"

export async function getSubredditRules(subredditName: string): Promise<string> {
  try {
    const response = await fetch(
      `https://www.reddit.com/r/${subredditName}/about/rules.json`,
      { headers: { "User-Agent": REDDIT_USER_AGENT } }
    )

    if (!response.ok) return ""

    const data = await response.json()
    const rules: Array<{ short_name: string; description: string }> = data.rules || []

    return rules
      .map((r) => `${r.short_name}: ${r.description}`)
      .join("\n")
  } catch {
    return ""
  }
}

export async function getRecentPostTitles(subredditName: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://www.reddit.com/r/${subredditName}/new.json?limit=10`,
      { headers: { "User-Agent": REDDIT_USER_AGENT } }
    )

    if (!response.ok) return []

    const data = await response.json()
    return (data.data?.children || []).map(
      (child: { data: { title: string } }) => child.data.title
    )
  } catch {
    return []
  }
}
