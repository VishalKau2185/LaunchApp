"use client"

import { useState, useTransition } from "react"
import { saveStartup } from "@/actions/startup"
import { Loader2, X } from "lucide-react"

interface InitialData {
  name: string | null
  description: string | null
  website: string | null
  category: string | null
  target_audience: string | null
  keywords: string[]
}

interface Props {
  initial: InitialData | null
}

const inputCls = "w-full px-3 py-2.5 rounded-lg text-sm"
const inputStyle = {
  background: "#0d0d0d",
  border: "1px solid #1c1c1c",
  color: "#efefef",
  outline: "none",
} as const

export default function OnboardingForm({ initial }: Props) {
  const isEditing = !!initial

  const [keywords, setKeywords] = useState<string[]>(initial?.keywords ?? [])
  const [keywordInput, setKeywordInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function addKeyword(kw: string) {
    const t = kw.trim().toLowerCase()
    if (t && !keywords.includes(t)) setKeywords((p) => [...p, t])
    setKeywordInput("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addKeyword(keywordInput) }
  }

  async function handleSubmit(formData: FormData) {
    formData.set("keywords", keywords.join(","))
    startTransition(async () => {
      const result = await saveStartup(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="p-6 max-w-xl mx-auto">

      {/* Header */}
      <div style={{ borderBottom: "1px solid #111", paddingBottom: 20, marginBottom: 24 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#2a2a2a", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>
          {isEditing ? "Edit startup" : "Setup · Step 1 of 1"}
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: "#efefef", lineHeight: 1.1 }}>
          {isEditing ? "Update your startup" : "Tell us about your startup"}
        </h1>
        <p style={{ fontSize: 13, color: "#444", marginTop: 8, lineHeight: 1.6 }}>
          {isEditing
            ? "Changes trigger a fresh community scan and rebuild today's posts."
            : "We'll find the right communities and generate 14 posts for you every morning."}
        </p>
      </div>

      <form action={handleSubmit} className="space-y-0">
        {error && (
          <div className="text-sm p-3 rounded-lg mb-5" style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.12)" }}>
            {error}
          </div>
        )}

        {/* Section: Identity */}
        <div className="space-y-4" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#2a2a2a", textTransform: "uppercase", fontFamily: "monospace" }}>Identity</p>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#555" }}>Startup name <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              name="name"
              placeholder="e.g. LaunchRadar"
              required
              defaultValue={initial?.name ?? ""}
              className={inputCls}
              style={inputStyle}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#555" }}>Website</label>
            <input
              name="website"
              type="url"
              placeholder="https://yourproduct.com"
              defaultValue={initial?.website ?? ""}
              className={inputCls}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ height: 1, background: "#111", marginBottom: 24 }} />

        {/* Section: What you do */}
        <div className="space-y-4" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#2a2a2a", textTransform: "uppercase", fontFamily: "monospace" }}>What you do</p>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#555" }}>Description <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea
              name="description"
              placeholder="What it does, who it's for, what problem it solves. Be specific — this shapes every post we write."
              rows={4}
              required
              defaultValue={initial?.description ?? ""}
              className={inputCls}
              style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#555" }}>Category</label>
            <input
              name="category"
              placeholder="e.g. SaaS, Dev Tools, Fitness, Music"
              defaultValue={initial?.category ?? ""}
              className={inputCls}
              style={inputStyle}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#555" }}>Target audience</label>
            <input
              name="target_audience"
              placeholder="e.g. indie hackers, musicians, fitness coaches"
              defaultValue={initial?.target_audience ?? ""}
              className={inputCls}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ height: 1, background: "#111", marginBottom: 24 }} />

        {/* Section: Keywords */}
        <div className="space-y-4" style={{ marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#2a2a2a", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 2 }}>Keywords</p>
            <p style={{ fontSize: 11, color: "#333", marginTop: 4 }}>Optional — auto-extracted from your description if left empty</p>
          </div>

          <div>
            <div
              className="flex flex-wrap gap-2 p-2.5 min-h-[44px]"
              style={{ background: "#0d0d0d", border: "1px solid #1c1c1c", borderRadius: 8 }}
            >
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md font-medium"
                  style={{ background: "#1a1a1a", color: "#888", border: "1px solid #222" }}
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => setKeywords((p) => p.filter((k) => k !== kw))}
                    style={{ color: "#444", lineHeight: 0 }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => keywordInput && addKeyword(keywordInput)}
                placeholder={keywords.length === 0 ? "Type and press Enter..." : ""}
                className="flex-1 min-w-[140px] bg-transparent text-sm outline-none"
                style={{ color: "#efefef", fontSize: 13 }}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {isEditing ? "Rebuilding your plan..." : "Finding communities..."}</>
          ) : (isEditing ? "Save Changes" : "Save & Find Communities")}
        </button>
      </form>
    </div>
  )
}
