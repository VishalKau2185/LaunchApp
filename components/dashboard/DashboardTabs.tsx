"use client"

import { useState } from "react"
import OpportunityCard from "./OpportunityCard"
import type { OpportunityWithCommunity } from "@/types/database"

const REDDIT_PLATFORMS    = new Set(["reddit"])
const TWITTER_PLATFORMS   = new Set(["twitter"])
const FOUNDER_PLATFORMS   = new Set(["indie_hackers", "hacker_news"])
const BLOG_PLATFORMS      = new Set(["devto", "hashnode", "medium"])
const DIRECTORY_PLATFORMS = new Set(["product_hunt", "betalist", "uneed", "launching_next", "sideprojectors", "microlaunch", "peerlist"])

type TabKey = "reddit" | "twitter" | "founder" | "blog" | "directories"

const TABS: { key: TabKey; label: string; color: string }[] = [
  { key: "reddit",      label: "Reddit",      color: "#ff6314" },
  { key: "twitter",     label: "Twitter",     color: "#1d9bf0" },
  { key: "founder",     label: "Founder",     color: "#22c55e" },
  { key: "blog",        label: "Blog",        color: "#a855f7" },
  { key: "directories", label: "Directories", color: "#f59e0b" },
]

const TAB_DESCRIPTIONS: Record<TabKey, string> = {
  reddit:      "Copy the post, open the link, paste and submit to the subreddit.",
  twitter:     "Click Open to launch the pre-filled tweet composer.",
  founder:     "Share your story with other founders. Honesty performs best here.",
  blog:        "Use this as a starting point — expand into a full article before publishing.",
  directories: "Copy the description, open the link, and fill in their submission form.",
}

function group(opps: OpportunityWithCommunity[]): Record<TabKey, OpportunityWithCommunity[]> {
  return {
    reddit:      opps.filter((o) => REDDIT_PLATFORMS.has(o.platform)),
    twitter:     opps.filter((o) => TWITTER_PLATFORMS.has(o.platform)),
    founder:     opps.filter((o) => FOUNDER_PLATFORMS.has(o.platform)),
    blog:        opps.filter((o) => BLOG_PLATFORMS.has(o.platform)),
    directories: opps.filter((o) => DIRECTORY_PLATFORMS.has(o.platform)),
  }
}

export default function DashboardTabs({ opportunities }: { opportunities: OpportunityWithCommunity[] }) {
  const groups = group(opportunities)
  const firstWithContent = TABS.find((t) => groups[t.key].length > 0)?.key ?? "reddit"
  const [activeTab, setActiveTab] = useState<TabKey>(firstWithContent)

  const activeOpps = groups[activeTab]
  const totalDone  = opportunities.filter((o) => o.status === "done").length
  const totalCount = opportunities.length
  const pct        = totalCount > 0 ? Math.round((totalDone / totalCount) * 100) : 0
  const allDone    = totalDone === totalCount && totalCount > 0

  const activeColor = TABS.find((t) => t.key === activeTab)?.color ?? "#fff"

  return (
    <div className="space-y-5">

      {/* Progress */}
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-4"
        style={{ background: "#0d0d0d", border: "1px solid #161616" }}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium" style={{ color: "#555" }}>
              {allDone ? "All done for today 🎉" : `${totalDone} of ${totalCount} posted`}
            </span>
            <span className="text-xs font-semibold tabular-nums" style={{ color: allDone ? "#22c55e" : "#efefef" }}>
              {pct}%
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "#111" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: allDone ? "#22c55e" : "linear-gradient(90deg, #ffffff 0%, #aaa 100%)",
                transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
        {TABS.map((tab) => {
          const opps    = groups[tab.key]
          if (opps.length === 0) return null
          const done    = opps.filter((o) => o.status === "done").length
          const tabDone = done === opps.length
          const isActive = activeTab === tab.key

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap shrink-0"
              style={{
                background:  isActive ? "#111" : "transparent",
                color:       isActive ? "#efefef" : "#3a3a3a",
                border:      isActive ? `1px solid #1c1c1c` : "1px solid transparent",
                borderBottom: isActive ? `2px solid ${tab.color}` : "1px solid transparent",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: tabDone ? "#22c55e" : tab.color, opacity: isActive ? 1 : 0.4 }}
              />
              {tab.label}
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full tabular-nums"
                style={{
                  background: tabDone ? "rgba(34,197,94,0.1)" : "#1a1a1a",
                  color:      tabDone ? "#22c55e" : "#444",
                }}
              >
                {done}/{opps.length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Tab hint */}
      <p className="text-xs leading-relaxed" style={{ color: "#333", maxWidth: "480px" }}>
        {TAB_DESCRIPTIONS[activeTab]}
      </p>

      {/* Cards */}
      <div className="space-y-2.5">
        {activeOpps.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
        {activeOpps.length === 0 && (
          <div
            className="rounded-xl p-6 text-center text-sm"
            style={{ background: "#0d0d0d", border: "1px solid #161616", color: "#333" }}
          >
            No posts for this platform today.
          </div>
        )}
      </div>

      {/* All done */}
      {allDone && (
        <div
          className="text-center py-4 rounded-xl text-sm font-medium"
          style={{ background: "rgba(34,197,94,0.06)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.12)" }}
        >
          All done for today — come back tomorrow for a fresh plan.
        </div>
      )}
    </div>
  )
}
