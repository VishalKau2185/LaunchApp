"use client"

import { useState, useTransition } from "react"
import { updatePassword, deleteAccount } from "@/actions/account"
import { Loader2 } from "lucide-react"

const inputCls = "w-full px-3 py-2.5 rounded-lg text-sm"
const inputStyle = {
  background: "#0d0d0d",
  border: "1px solid #1c1c1c",
  color: "#efefef",
  outline: "none",
} as const

export default function AccountForm({ email }: { email: string }) {
  const [pwError, setPwError]     = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState<string | null>(null)
  const [delConfirm, setDelConfirm] = useState(false)
  const [delError, setDelError]   = useState<string | null>(null)

  const [pwPending,  startPw]  = useTransition()
  const [delPending, startDel] = useTransition()

  function handlePw(formData: FormData) {
    setPwError(null); setPwSuccess(null)
    startPw(async () => {
      const res = await updatePassword(formData)
      if (res.error)   setPwError(res.error)
      if (res.success) setPwSuccess(res.success)
    })
  }

  function handleDelete() {
    setDelError(null)
    startDel(async () => {
      const res = await deleteAccount()
      if (res?.error) setDelError(res.error)
    })
  }

  return (
    <div className="space-y-3">

      {/* Email */}
      <div
        className="rounded-xl p-5 space-y-3"
        style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
      >
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#2a2a2a", textTransform: "uppercase", fontFamily: "monospace" }}>Profile</p>
        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: "#555" }}>Email address</label>
          <div
            className="px-3 py-2.5 rounded-lg text-sm"
            style={{ background: "#080808", border: "1px solid #141414", color: "#444" }}
          >
            {email}
          </div>
          <p style={{ fontSize: 11, color: "#2a2a2a", marginTop: 4 }}>Email cannot be changed.</p>
        </div>
      </div>

      {/* Change password */}
      <div
        className="rounded-xl p-5 space-y-4"
        style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
      >
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#2a2a2a", textTransform: "uppercase", fontFamily: "monospace" }}>Change Password</p>

        {pwError && (
          <div className="text-sm p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.12)" }}>
            {pwError}
          </div>
        )}
        {pwSuccess && (
          <div className="text-sm p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.06)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.12)" }}>
            {pwSuccess}
          </div>
        )}

        <form action={handlePw} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#555" }}>Current password</label>
            <input
              name="current_password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#555" }}>New password</label>
            <input
              name="new_password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "#555" }}>Confirm new password</label>
            <input
              name="confirm_password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            disabled={pwPending}
            className="btn-primary flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {pwPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {pwPending ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div
        className="rounded-xl p-5 space-y-4"
        style={{ background: "#0d0d0d", border: "1px solid rgba(239,68,68,0.12)" }}
      >
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#ef4444", textTransform: "uppercase", fontFamily: "monospace", opacity: 0.7 }}>Danger Zone</p>

        {delError && (
          <div className="text-sm p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.12)" }}>
            {delError}
          </div>
        )}

        <p className="text-sm leading-relaxed" style={{ color: "#444" }}>
          Permanently deletes your account, startup info, communities, and all generated posts. Cannot be undone.
        </p>

        {!delConfirm ? (
          <button
            onClick={() => setDelConfirm(true)}
            className="text-sm font-medium px-4 py-2 rounded-lg"
            style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.12)" }}
          >
            Delete Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold" style={{ color: "#ef4444" }}>
              This deletes everything immediately.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={delPending}
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
                style={{ background: "#ef4444", color: "#fff" }}
              >
                {delPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {delPending ? "Deleting..." : "Yes, delete everything"}
              </button>
              <button
                onClick={() => setDelConfirm(false)}
                className="text-sm font-medium px-4 py-2 rounded-lg"
                style={{ background: "#111", color: "#555", border: "1px solid #1c1c1c" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
