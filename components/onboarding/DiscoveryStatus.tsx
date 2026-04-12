"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { retryDiscovery } from "@/actions/startup"
import type { DiscoveryStatus } from "@/types/database"

interface Props {
  startupId: string
  initialStatus: DiscoveryStatus
}

export default function DiscoveryStatus({ startupId, initialStatus }: Props) {
  const [status, setStatus] = useState<DiscoveryStatus>(initialStatus)
  const [message, setMessage] = useState("Searching Reddit for communities...")
  const router = useRouter()
  const hasFired = useRef(false)

  useEffect(() => {
    if (status !== "in_progress") return
    if (hasFired.current) return
    hasFired.current = true

    // Fire the discovery API route — it searches Reddit, classifies, caches results
    const runDiscovery = async () => {
      setMessage("Searching Reddit for communities...")
      try {
        const res = await fetch("/api/discover", { method: "POST" })
        if (res.ok) {
          setMessage("Community pool ready — loading your plan...")
          setStatus("complete")
        } else {
          setStatus("error")
        }
      } catch {
        setStatus("error")
      }
    }

    void runDiscovery()
  }, [status])

  useEffect(() => {
    if (status === "complete") {
      router.refresh()
    }
  }, [status, router])

  if (status === "complete") {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: "#22c55e" }}>
        <CheckCircle2 className="w-4 h-4" />
        {message}
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm" style={{ color: "#ef4444" }}>
          <XCircle className="w-4 h-4" />
          Discovery failed
        </div>
        <form action={async () => {
          await retryDiscovery(startupId)
          hasFired.current = false
          setStatus("in_progress")
        }}>
          <button
            type="submit"
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: "#1a1a1a", color: "#9ca3af", border: "1px solid #2a2a2a" }}
          >
            Retry
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm" style={{ color: "#6b7280" }}>
        <Loader2 className="w-4 h-4 animate-spin" />
        {message}
      </div>
      <p className="text-xs" style={{ color: "#4b5563" }}>
        Searching Reddit for communities relevant to your startup and checking which ones allow self-promotion.
      </p>
    </div>
  )
}
