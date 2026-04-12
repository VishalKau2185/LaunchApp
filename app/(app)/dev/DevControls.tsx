"use client"

import { useTransition } from "react"
import { resetTodaysPlan, simulateNextDay, clearAllHistory, markAllDoneToday } from "@/actions/dev"
import { Loader2 } from "lucide-react"

interface Props {
  hasTodayPlan: boolean
}

export default function DevControls({ hasTodayPlan }: Props) {
  const [resetting,   startReset]    = useTransition()
  const [advancing,  startAdvance]   = useTransition()
  const [clearing,   startClear]     = useTransition()
  const [marking,    startMark]      = useTransition()

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {/* Next day */}
        <ControlRow
          label="Simulate Next Day"
          description="Saves today's subreddits as 'used yesterday' then regenerates a fresh plan. Subreddits from today are deprioritised so you get different ones — exactly how daily rotation works."
          buttonLabel="Next Day →"
          loading={advancing}
          disabled={!hasTodayPlan}
          disabledReason="Generate today's plan first"
          onClick={() => startAdvance(() => { void simulateNextDay() })}
        />

        {/* Reset today */}
        <ControlRow
          label="Reset Today's Plan"
          description="Deletes today's posts and regenerates them from scratch with fresh AI content. Subreddit rotation is unchanged."
          buttonLabel="Reset Today"
          loading={resetting}
          disabled={!hasTodayPlan}
          disabledReason="No plan generated yet today"
          onClick={() => startReset(() => { void resetTodaysPlan() })}
          danger
        />

        {/* Mark all done */}
        <ControlRow
          label="Mark All Done Today"
          description="Marks all of today's posts as done — tests the 'all done' banner and progress bar."
          buttonLabel="Mark All Done"
          loading={marking}
          disabled={!hasTodayPlan}
          disabledReason="No plan generated yet today"
          onClick={() => startMark(() => { void markAllDoneToday() })}
        />

        {/* Clear everything */}
        <ControlRow
          label="Full Reset"
          description="Clears all history, the community pool, and resets discovery. The next dashboard load re-runs Reddit search from scratch."
          buttonLabel="Full Reset"
          loading={clearing}
          onClick={() => startClear(() => { void clearAllHistory() })}
          danger
        />
      </div>

      <div className="text-xs space-y-1.5 pt-1" style={{ color: "#4b5563" }}>
        <p>
          <strong style={{ color: "#6b7280" }}>How rotation works:</strong> Every day the scheduler picks 8 subreddits, deprioritising any used in the last 14 days. After 14 days they become available again.
        </p>
        <p>
          <strong style={{ color: "#6b7280" }}>Community pool:</strong> ~15 dynamic subs found via Reddit search on first save + 200 seed communities. Together that&apos;s enough variety for weeks without repeating.
        </p>
        <p>
          <strong style={{ color: "#6b7280" }}>Non-Reddit platforms:</strong> Founder alternates IH/HN daily. Blog cycles dev.to → Hashnode → Medium. Directories cycle all 7 platforms (2 per day).
        </p>
        <p>
          <strong style={{ color: "#6b7280" }}>AI generation:</strong> Each slot uses a different post template so posts don&apos;t feel identical even within the same day.
        </p>
      </div>
    </div>
  )
}

function ControlRow({
  label,
  description,
  buttonLabel,
  loading,
  disabled,
  disabledReason,
  onClick,
  danger,
}: {
  label: string
  description: string
  buttonLabel: string
  loading: boolean
  disabled?: boolean
  disabledReason?: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <div
      className="flex items-start justify-between gap-4 rounded-lg p-3"
      style={{ background: "#111111", border: "1px solid #1f1f1f" }}
    >
      <div className="space-y-0.5">
        <p className="text-sm font-medium" style={{ color: "#f0f0f0" }}>{label}</p>
        <p className="text-xs leading-relaxed" style={{ color: "#4b5563" }}>{description}</p>
        {disabled && disabledReason && (
          <p className="text-xs" style={{ color: "#4b5563" }}>({disabledReason})</p>
        )}
      </div>
      <button
        onClick={onClick}
        disabled={loading || disabled}
        className="shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-40"
        style={{
          background: danger ? "rgba(239,68,68,0.1)" : "#1a1a1a",
          color: danger ? "#ef4444" : "#9ca3af",
          border: `1px solid ${danger ? "rgba(239,68,68,0.2)" : "#2a2a2a"}`,
        }}
      >
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {loading ? "..." : buttonLabel}
      </button>
    </div>
  )
}
