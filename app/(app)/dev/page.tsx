import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { getScheduleInfo } from "@/lib/rotation/daily-scheduler"
import { selectRedditCommunities } from "@/lib/communities/discovery"
import { DEV_OFFSET_COOKIE, getSimulatedDate } from "@/lib/dev-date"
import DevControls from "./DevControls"

export default async function DevPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const cookieStore = await cookies()
  const devOffset = parseInt(cookieStore.get(DEV_OFFSET_COOKIE)?.value ?? "0", 10)
  const today = getSimulatedDate(devOffset)

  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // 7-day rotation preview starting from current simulated date
  const schedule = Array.from({ length: 7 }, (_, i) => getScheduleInfo(devOffset + i))

  // Subreddit preview using real startup data (if available)
  const subreddits = startup ? selectRedditCommunities(
    startup.keywords ?? [],
    startup.category,
    startup.target_audience,
    startup.description,
    new Set<string>(), // no rotation filter — show raw scores
    12               // show top 12 so user can see how the pool looks
  ) : []

  // Count today's (simulated) posted items
  const { data: todayOpps } = await supabase
    .from("daily_opportunities")
    .select("id, platform, status, slot_index")
    .eq("user_id", user.id)
    .eq("date", today)
    .order("slot_index", { ascending: true })

  // History count (for rotation context)
  const since = new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0]
  const { data: history } = await supabase
    .from("daily_opportunities")
    .select("date, platform")
    .eq("user_id", user.id)
    .eq("platform", "reddit")
    .gte("date", since)
    .order("date", { ascending: false })

  const historyByDate: Record<string, number> = {}
  for (const row of history ?? []) {
    historyByDate[row.date] = (historyByDate[row.date] ?? 0) + 1
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#f0f0f0" }}>Dev / Simulation Panel</h1>
        <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
          Test and verify the system. All controls are safe — they only affect your account.
        </p>
      </div>

      {/* Today's status */}
      <Section title="Today's Plan Status">
        <div className="space-y-3">
          {todayOpps && todayOpps.length > 0 ? (
            <>
              <div className="flex items-center gap-3 text-sm">
                <span style={{ color: "#9ca3af" }}>
                  <strong style={{ color: "#f0f0f0" }}>{todayOpps.length}</strong> posts generated
                </span>
                <span style={{ color: "#9ca3af" }}>
                  <strong style={{ color: "#22c55e" }}>{todayOpps.filter(o => o.status === "done").length}</strong> marked done
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {todayOpps.map((o) => (
                  <div
                    key={o.id}
                    className="text-xs px-2 py-1.5 rounded-md flex items-center justify-between"
                    style={{ background: "#111111", border: "1px solid #1f1f1f" }}
                  >
                    <span style={{ color: "#9ca3af" }}>Slot {o.slot_index} · {o.platform}</span>
                    <span style={{ color: o.status === "done" ? "#22c55e" : "#4b5563" }}>
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm" style={{ color: "#4b5563" }}>No posts generated for today yet. Go to the dashboard to generate them.</p>
          )}
        </div>
      </Section>

      {/* Controls */}
      <Section title="Simulation Controls">
        <DevControls hasTodayPlan={(todayOpps?.length ?? 0) > 0} />
      </Section>

      {/* 7-day rotation preview */}
      <Section title="7-Day Rotation Preview">
        <p className="text-xs mb-3" style={{ color: "#4b5563" }}>
          Shows which platforms rotate into each slot for the next 7 days. Reddit subreddit selection changes daily based on your posting history.
        </p>
        <div className="space-y-2">
          {schedule.map((day, i) => (
            <div
              key={day.date}
              className="rounded-lg p-3 grid grid-cols-[80px_1fr_1fr_1fr] gap-2 items-center text-xs"
              style={{
                background: i === 0 ? "#1a1a1a" : "#111111",
                border: `1px solid ${i === 0 ? "#2a2a2a" : "#1f1f1f"}`,
              }}
            >
              <div>
                <div style={{ color: i === 0 ? "#f0f0f0" : "#6b7280", fontWeight: i === 0 ? 600 : 400 }}>
                  {i === 0 ? "Today" : `Day +${i}`}
                </div>
                <div style={{ color: "#4b5563", fontSize: "10px" }}>{day.date}</div>
              </div>
              <div>
                <div style={{ color: "#9ca3af" }}>Founder</div>
                <div style={{ color: "#f0f0f0" }}>{day.founderLabel}</div>
              </div>
              <div>
                <div style={{ color: "#9ca3af" }}>Blog</div>
                <div style={{ color: "#f0f0f0" }}>{day.blogLabel}</div>
              </div>
              <div>
                <div style={{ color: "#9ca3af" }}>Directories</div>
                <div style={{ color: "#f0f0f0" }}>{day.directories[0].name}</div>
                <div style={{ color: "#f0f0f0" }}>{day.directories[1].name}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Reddit posting history */}
      <Section title="Reddit Posting History (Last 14 Days)">
        {Object.keys(historyByDate).length > 0 ? (
          <div className="space-y-1.5">
            {Object.entries(historyByDate)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([date, count]) => (
                <div key={date} className="flex items-center justify-between text-xs" style={{ color: "#9ca3af" }}>
                  <span>{date}</span>
                  <span>{count} subreddits posted</span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-xs" style={{ color: "#4b5563" }}>No Reddit posting history yet. Subreddit rotation starts fresh.</p>
        )}
      </Section>

      {/* Subreddit preview */}
      <Section title={`Subreddit Selection Preview${startup ? ` for ${startup.name}` : ""}`}>
        {!startup ? (
          <p className="text-xs" style={{ color: "#4b5563" }}>Save your startup first to see which subreddits would be selected.</p>
        ) : (
          <>
            <p className="text-xs mb-3" style={{ color: "#4b5563" }}>
              Top 12 subreddits from the seeded database that match your startup. The daily plan picks 8 of these, deprioritizing ones you've posted to recently.
            </p>
            <div className="space-y-1.5">
              {subreddits.map((s, i) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-xs"
                  style={{ background: "#111111", border: "1px solid #1f1f1f" }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#4b5563", width: "16px" }}>{i + 1}.</span>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#ff6314" }}
                    >
                      r/{s.name}
                    </a>
                  </div>
                  <span style={{ color: "#4b5563" }}>slot {i}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold" style={{ color: "#9ca3af" }}>{title}</h2>
      <div
        className="rounded-xl p-4"
        style={{ background: "#0f0f0f", border: "1px solid #1f1f1f" }}
      >
        {children}
      </div>
    </div>
  )
}
