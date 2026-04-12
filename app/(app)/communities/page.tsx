import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { selectRedditCommunities } from "@/lib/communities/discovery"
import { subredditFromUrl } from "@/lib/rotation/daily-scheduler"
import { DEV_OFFSET_COOKIE, getSimulatedDate } from "@/lib/dev-date"

export default async function CommunitiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!startup) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="text-center py-16" style={{ color: "#6b7280" }}>
          <p>No startup yet. Add your startup to see your community pool.</p>
        </div>
      </div>
    )
  }

  const cookieStore = await cookies()
  const devOffset = parseInt(cookieStore.get(DEV_OFFSET_COOKIE)?.value ?? "0", 10)
  const today = getSimulatedDate(devOffset)

  // Subreddits actually scheduled for today (from cached plan)
  const { data: todayPosts } = await supabase
    .from("daily_opportunities")
    .select("post_url")
    .eq("user_id", user.id)
    .eq("platform", "reddit")
    .eq("date", today)

  const inTodaysPlan = new Set<string>()
  for (const row of todayPosts ?? []) {
    const name = subredditFromUrl(row.post_url)
    if (name) inTodaysPlan.add(name.toLowerCase())
  }

  // Subreddits used in the last 14 days (for rotation context)
  const since = new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0]
  const { data: recentPosts } = await supabase
    .from("daily_opportunities")
    .select("post_url, date")
    .eq("user_id", user.id)
    .eq("platform", "reddit")
    .gte("date", since)

  const recentlyUsed = new Set<string>()
  for (const row of recentPosts ?? []) {
    // Don't count today's plan as "recently used" — those are current
    if (row.date === today) continue
    const name = subredditFromUrl(row.post_url)
    if (name) recentlyUsed.add(name.toLowerCase())
  }

  // Raw relevance ranking — no rotation filter so ranking is stable and accurate
  const allCommunities = selectRedditCommunities(
    startup.keywords ?? [],
    startup.category,
    startup.target_audience,
    startup.description,
    new Set<string>(),
    30
  )

  // Pin today's plan to top, then the rest by relevance score
  const todayList  = allCommunities.filter((c) => inTodaysPlan.has(c.name.toLowerCase()))
  const restList   = allCommunities.filter((c) => !inTodaysPlan.has(c.name.toLowerCase()))
  const communities = [...todayList, ...restList]

  const hasTodayPlan = inTodaysPlan.size > 0

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#f0f0f0" }}>Subreddits</h1>
        <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
          {communities.length} subreddits matched for{" "}
          <strong style={{ color: "#f0f0f0" }}>{startup.name}</strong>
          {recentlyUsed.size > 0 && ` · ${recentlyUsed.size} used recently`}
        </p>
      </div>

      {!hasTodayPlan && (
        <div
          className="text-sm p-3 rounded-lg"
          style={{ background: "#111111", border: "1px solid #1f1f1f", color: "#6b7280" }}
        >
          Go to the dashboard to generate today&apos;s plan — it will pick 8 of these subreddits.
        </div>
      )}

      {communities.length === 0 && (
        <div
          className="text-center py-16 rounded-xl"
          style={{ background: "#111111", border: "1px solid #1f1f1f", color: "#4b5563" }}
        >
          <p>No matching subreddits found yet.</p>
          <p className="text-xs mt-1">Try updating your keywords or category in My Startup.</p>
        </div>
      )}

      {hasTodayPlan && (
        <p className="text-xs" style={{ color: "#4b5563" }}>
          Today&apos;s 8 subreddits are pinned at the top. The rest rotate in over coming days.
        </p>
      )}

      <div className="space-y-1.5">
        {communities.map((c, i) => {
          const isToday  = inTodaysPlan.has(c.name.toLowerCase())
          const isRecent = !isToday && recentlyUsed.has(c.name.toLowerCase())

          return (
            <div
              key={c.name}
              className="rounded-lg px-4 py-3 flex items-center justify-between gap-3"
              style={{
                background: "#111111",
                border: `1px solid ${isToday ? "rgba(255,99,20,0.2)" : "#1f1f1f"}`,
                opacity: isRecent ? 0.45 : 1,
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs w-6 shrink-0 text-right" style={{ color: "#4b5563" }}>{i + 1}</span>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:underline truncate"
                  style={{ color: isRecent ? "#6b7280" : "#f0f0f0" }}
                >
                  r/{c.name}
                </a>
                {isToday && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: "rgba(255,99,20,0.1)", color: "#ff6314" }}
                  >
                    today
                  </span>
                )}
                {isRecent && (
                  <span className="text-xs shrink-0" style={{ color: "#4b5563" }}>
                    used recently
                  </span>
                )}
              </div>

              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2 py-1 rounded shrink-0"
                style={{ background: "#1a1a1a", color: "#6b7280", border: "1px solid #2a2a2a" }}
              >
                Visit →
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
