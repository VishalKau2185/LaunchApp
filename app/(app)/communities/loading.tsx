export default function CommunitiesLoading() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-36 rounded-lg" style={{ background: "#1a1a1a" }} />
        <div className="h-4 w-56 rounded" style={{ background: "#1a1a1a" }} />
      </div>
      <div className="space-y-1.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-lg px-4 py-3 flex items-center justify-between" style={{ background: "#111111", border: "1px solid #1f1f1f" }}>
            <div className="flex items-center gap-3">
              <div className="h-4 w-6 rounded" style={{ background: "#1a1a1a" }} />
              <div className="h-4 rounded" style={{ background: "#1a1a1a", width: `${80 + (i % 5) * 20}px` }} />
            </div>
            <div className="h-6 w-12 rounded" style={{ background: "#1a1a1a" }} />
          </div>
        ))}
      </div>
    </div>
  )
}
