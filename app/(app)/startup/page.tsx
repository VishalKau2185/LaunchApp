import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Pencil, ExternalLink } from "lucide-react"
import DiscoveryStatus from "@/components/onboarding/DiscoveryStatus"
import type { DiscoveryStatus as DS } from "@/types/database"

export default async function StartupPage() {
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
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center space-y-4">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#2a2a2a", textTransform: "uppercase", fontFamily: "monospace" }}>My Startup</p>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", color: "#efefef" }}>No startup added yet</h1>
          <Link
            href="/onboarding"
            className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Add Startup
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-xl mx-auto">

      {/* Header */}
      <div style={{ borderBottom: "1px solid #111", paddingBottom: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#2a2a2a", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>
              My Startup
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: "#efefef" }}>
              {startup.name}
            </h1>
            {startup.website && (
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 mt-1"
                style={{ fontSize: 12, color: "#333", textDecoration: "none" }}
              >
                <ExternalLink className="w-3 h-3" />
                {startup.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg shrink-0 mt-1"
            style={{ background: "#111", color: "#555", border: "1px solid #1c1c1c" }}
          >
            <Pencil className="w-3 h-3" /> Edit
          </Link>
        </div>
      </div>

      <div className="space-y-3">

        {/* Details card */}
        <div
          className="rounded-xl p-5 space-y-5"
          style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#2a2a2a", textTransform: "uppercase", fontFamily: "monospace" }}>Details</p>

          {startup.description && (
            <div className="space-y-1">
              <p className="text-xs font-medium" style={{ color: "#555" }}>Description</p>
              <p className="text-sm leading-relaxed" style={{ color: "#888" }}>{startup.description}</p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {startup.category && (
              <div className="space-y-1">
                <p className="text-xs font-medium" style={{ color: "#555" }}>Category</p>
                <p className="text-sm" style={{ color: "#888" }}>{startup.category}</p>
              </div>
            )}
            {startup.target_audience && (
              <div className="space-y-1">
                <p className="text-xs font-medium" style={{ color: "#555" }}>Audience</p>
                <p className="text-sm" style={{ color: "#888" }}>{startup.target_audience}</p>
              </div>
            )}
          </div>

          {startup.keywords && startup.keywords.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium" style={{ color: "#555" }}>Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {startup.keywords.map((kw: string) => (
                  <span
                    key={kw}
                    className="text-xs px-2.5 py-1 rounded-md font-medium"
                    style={{ background: "#1a1a1a", color: "#666", border: "1px solid #222" }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Discovery status */}
        <div
          className="rounded-xl p-5 space-y-4"
          style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#2a2a2a", textTransform: "uppercase", fontFamily: "monospace" }}>Community Pool</p>
          <DiscoveryStatus
            startupId={startup.id}
            initialStatus={startup.discovery_status as DS}
          />
        </div>

      </div>
    </div>
  )
}
