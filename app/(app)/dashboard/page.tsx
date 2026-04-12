import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getTodaysOpportunities } from "@/lib/rotation/daily-scheduler"
import { regeneratePlan } from "@/actions/dev"
import DashboardTabs from "@/components/dashboard/DashboardTabs"
import DiscoveryStatus from "@/components/onboarding/DiscoveryStatus"
import type { DiscoveryStatus as DS } from "@/types/database"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: startup } = await supabase
    .from("startups")
    .select("id, name, discovery_status, updated_at")
    .eq("user_id", user.id)
    .single()

  const today = new Date().toISOString().split("T")[0]

  const displayDate = new Date(today + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  })

  // No startup yet
  if (!startup) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center space-y-4 max-w-sm">
          <h1 className="text-xl font-bold" style={{ color: "#f0f0f0" }}>Welcome to Loudpost</h1>
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Add your startup to get daily posting opportunities across Reddit, Twitter, founder communities, blogs, and directories.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "#ffffff", color: "#000000" }}
          >
            Add Your Startup
          </Link>
        </div>
      </div>
    )
  }

  // Weekly re-discovery: refresh community pool every 7 days
  if (startup.discovery_status === "complete" && startup.updated_at) {
    const daysSince = (Date.now() - new Date(startup.updated_at).getTime()) / 86400000
    if (daysSince > 7) {
      await supabase.from("startups")
        .update({ discovery_status: "in_progress", updated_at: new Date().toISOString() })
        .eq("id", startup.id)
      await supabase.from("user_communities").delete().eq("user_id", user.id)
      startup.discovery_status = "in_progress"
    }
  }

  // Discovery in progress
  if (startup.discovery_status !== "complete") {
    return (
      <div className="p-8 max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#f0f0f0" }}>Building your community pool</h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            Finding the best communities for <span style={{ color: "#f0f0f0" }}>{startup.name}</span>
          </p>
        </div>
        <DiscoveryStatus startupId={startup.id} initialStatus={startup.discovery_status as DS} />
      </div>
    )
  }

  const opportunities = await getTodaysOpportunities(user.id, today)

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">

      {/* Masthead header */}
      <div style={{ borderBottom: "1px solid #111", paddingBottom: 20, marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#2a2a2a", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>
              Daily briefing
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", color: "#efefef", lineHeight: 1 }}>
              {displayDate}
            </h1>
            <p style={{ fontSize: 13, color: "#333", marginTop: 6, fontWeight: 500 }}>
              {startup.name}
            </p>
          </div>
          {opportunities.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "flex-start", marginTop: 4 }}>
              {[
                { label: "Reddit", count: opportunities.filter(o => o.platform === "reddit").length, color: "#ff6314" },
                { label: "Twitter", count: opportunities.filter(o => o.platform === "twitter").length, color: "#1d9bf0" },
                { label: "Founder", count: opportunities.filter(o => ["indie_hackers","hacker_news"].includes(o.platform)).length, color: "#22c55e" },
                { label: "Blog", count: opportunities.filter(o => ["devto","hashnode","medium"].includes(o.platform)).length, color: "#a855f7" },
                { label: "Dir.", count: opportunities.filter(o => ["product_hunt","betalist","uneed","launching_next","sideprojectors","microlaunch","peerlist"].includes(o.platform)).length, color: "#f59e0b" },
              ].filter(p => p.count > 0).map(p => (
                <span key={p.label} style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 8px",
                  borderRadius: 6, color: p.color,
                  background: `${p.color}12`, border: `1px solid ${p.color}20`,
                  fontFamily: "monospace",
                }}>
                  {p.label} ×{p.count}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {opportunities.length === 0 ? (
        <div
          className="rounded-xl p-6 space-y-4"
          style={{ background: "#111111", border: "1px solid #1f1f1f" }}
        >
          <p className="text-sm font-medium" style={{ color: "#9ca3af" }}>
            Couldn&apos;t generate today&apos;s posts
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#4b5563" }}>
            Something went wrong generating your posts. Try again or edit your startup info.
          </p>
          <div className="flex gap-3 flex-wrap">
            <form action={regeneratePlan}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{ background: "#ffffff", color: "#000000" }}
              >
                Try Again
              </button>
            </form>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ background: "#1a1a1a", color: "#9ca3af", border: "1px solid #2a2a2a" }}
            >
              Edit Startup
            </Link>
          </div>
        </div>
      ) : (
        <DashboardTabs opportunities={opportunities} />
      )}
    </div>
  )
}
