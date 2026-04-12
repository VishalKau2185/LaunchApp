import Link from "next/link"
import { signIn } from "@/actions/auth"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#080808" }}>
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 70%)" }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
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
            <h1 className="text-xl font-bold tracking-tight" style={{ color: "#efefef" }}>Welcome back</h1>
            <p className="text-sm" style={{ color: "#444" }}>Sign in to continue</p>
          </div>

          {params.error && (
            <div className="text-sm p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.12)" }}>
              {params.error}
            </div>
          )}

          <form action={signIn} className="space-y-3">
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
                name="password" type="password" placeholder="••••••••" required autoComplete="current-password"
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ background: "#111", border: "1px solid #1c1c1c", color: "#efefef" }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-2.5 rounded-lg text-sm font-semibold mt-1"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="text-sm text-center mt-5" style={{ color: "#333" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#666" }} className="font-medium">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}
