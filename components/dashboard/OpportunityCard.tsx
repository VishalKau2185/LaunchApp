"use client"

import { useState } from "react"
import { Copy, ExternalLink, CheckCircle2, Check } from "lucide-react"
import { markDone } from "@/actions/opportunities"
import type { OpportunityWithCommunity } from "@/types/database"

const PLATFORM_CONFIG: Record<string, { label: string; color: string }> = {
  reddit:         { label: "Reddit",         color: "#ff6314" },
  twitter:        { label: "Twitter / X",    color: "#1d9bf0" },
  indie_hackers:  { label: "Indie Hackers",  color: "#22c55e" },
  hacker_news:    { label: "Hacker News",    color: "#f97316" },
  devto:          { label: "dev.to",         color: "#a855f7" },
  hashnode:       { label: "Hashnode",       color: "#2563eb" },
  medium:         { label: "Medium",         color: "#aaaaaa" },
  product_hunt:   { label: "Product Hunt",   color: "#da552f" },
  betalist:       { label: "BetaList",       color: "#ec4899" },
  uneed:          { label: "Uneed",          color: "#06b6d4" },
  launching_next: { label: "LaunchingNext",  color: "#84cc16" },
  sideprojectors: { label: "SideProjectors", color: "#f59e0b" },
  microlaunch:    { label: "MicroLaunch",    color: "#8b5cf6" },
  peerlist:       { label: "Peerlist",       color: "#10b981" },
}

interface Props {
  opportunity: OpportunityWithCommunity
}

function subredditFromUrl(url: string): string | null {
  const m = url.match(/reddit\.com\/r\/([^/?#]+)/)
  return m ? m[1] : null
}

export default function OpportunityCard({ opportunity: initial }: Props) {
  const [opp, setOpp]           = useState(initial)
  const [status, setStatus]     = useState(initial.status)
  const [copied, setCopied]   = useState(false)
  const [doneLoading, setDoneLoading] = useState(false)

  const cfg      = PLATFORM_CONFIG[opp.platform] ?? { label: opp.platform, color: "#555" }
  const isDone   = status === "done"

  const destination = opp.platform === "reddit"
    ? `r/${subredditFromUrl(opp.post_url) ?? "reddit"}`
    : opp.community_name ?? cfg.label

  const copyText = opp.generated_title
    ? `${opp.generated_title}\n\n${opp.generated_body}`
    : opp.generated_body

  async function handleCopy() {
    await navigator.clipboard.writeText(copyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDone() {
    setDoneLoading(true)
    const result = await markDone(opp.id)
    if (!result.error) setStatus("done")
    setDoneLoading(false)
  }

  return (
    <div
      className="card-hover rounded-xl flex flex-col"
      style={{
        background:   isDone ? "#0a0a0a" : "#0d0d0d",
        border:       `1px solid ${isDone ? "#181818" : "#181818"}`,
        borderLeft:   `3px solid ${isDone ? "rgba(34,197,94,0.4)" : cfg.color}`,
        opacity:      isDone ? 0.6 : 1,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3" style={{ borderBottom: "1px solid #111" }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs font-semibold tracking-tight shrink-0" style={{ color: cfg.color }}>
            {cfg.label}
          </span>
          <span className="text-xs" style={{ color: "#333" }}>·</span>
          <span className="text-xs truncate" style={{ color: "#555" }}>
            {destination}
          </span>
        </div>
        {isDone && (
          <span className="flex items-center gap-1 text-xs font-medium shrink-0" style={{ color: "#22c55e" }}>
            <CheckCircle2 className="w-3 h-3" />
            Done
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-2 flex-1">
        {opp.generated_title && (
          <p className="text-sm font-semibold leading-snug" style={{ color: "#efefef" }}>
            {opp.generated_title}
          </p>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#666" }}>
          {opp.generated_body}
        </p>
      </div>

      {/* Actions */}
      {!isDone && (
        <div
          className="flex items-center gap-2 px-4 py-3 flex-wrap"
          style={{ borderTop: "1px solid #111" }}
        >
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
            style={{
              background: copied ? "rgba(34,197,94,0.1)" : "#111",
              color:      copied ? "#22c55e" : "#888",
              border:     `1px solid ${copied ? "rgba(34,197,94,0.2)" : "#1c1c1c"}`,
            }}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>

          <a
            href={opp.post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
            style={{ background: "#111", color: "#888", border: "1px solid #1c1c1c" }}
          >
            <ExternalLink className="w-3 h-3" />
            Open
          </a>

          <button
            onClick={handleDone}
            disabled={doneLoading}
            className="ml-auto flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-40"
            style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.15)" }}
          >
            <CheckCircle2 className="w-3 h-3" />
            {doneLoading ? "..." : "Mark done"}
          </button>
        </div>
      )}
    </div>
  )
}
