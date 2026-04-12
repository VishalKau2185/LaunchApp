export default function DashboardLoading() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-6 w-44 rounded-lg" style={{ background: "#1a1a1a" }} />
          <div className="h-4 w-36 rounded" style={{ background: "#1a1a1a" }} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full" style={{ background: "#1a1a1a" }} />
        <div className="h-4 w-20 rounded" style={{ background: "#1a1a1a" }} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {[80, 72, 76, 60, 96].map((w, i) => (
          <div key={i} className="h-8 rounded-lg shrink-0" style={{ background: "#1a1a1a", width: `${w}px` }} />
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-5 space-y-3" style={{ background: "#111111", border: "1px solid #1f1f1f" }}>
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 rounded-md" style={{ background: "#1a1a1a" }} />
              <div className="h-4 w-24 rounded" style={{ background: "#1a1a1a" }} />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded" style={{ background: "#1a1a1a" }} />
              <div className="h-4 w-full rounded" style={{ background: "#1a1a1a" }} />
              <div className="h-4 w-5/6 rounded" style={{ background: "#1a1a1a" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
