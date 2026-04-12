"use client"

import Link from "next/link"
import { useState } from "react"
import { signUp } from "@/actions/auth"

export default function SignUpPage() {
  const [message, setMessage] = useState<string | null>(null)
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true); setError(null); setMessage(null)
    const result = await signUp(formData)
    setLoading(false)
    if (result?.error)   setError(result.error)
    if (result?.success) setMessage(result.success)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#080808" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 70%)" }} />

      <div className="relative w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ background: "#fff", color: "#000" }}>
            LP
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: "#efefef" }}>Loudpost</span>
        </div>

        <div
          className="rounded-2xl p-7 space-y-5"
          style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
        >
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight" style={{ color: "#efefef" }}>Create an account</h1>
            <p className="text-sm" style={{ color: "#444" }}>Start posting to communities in minutes</p>
          </div>

          {error && (
            <div className="text-sm p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.12)" }}>
              {error}
            </div>
          )}
          {message && (
            <div className="text-sm p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.06)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.12)" }}>
              {message}
            </div>
          )}

          <form action={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "#555" }}>Email</label>
              <input
                name="email" type="email" placeholder="you@example.com" required autoComplete="email"
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ background: "#111", border: "1px solid #1c1c1c", color: "#efefef" }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: "#555" }}>Password</label>
              <input
                name="password" type="password" placeholder="••••••••" required minLength={6} autoComplete="new-password"
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ background: "#111", border: "1px solid #1c1c1c", color: "#efefef" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 rounded-lg text-sm font-semibold mt-1 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-sm text-center mt-5" style={{ color: "#333" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#666" }} className="font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
