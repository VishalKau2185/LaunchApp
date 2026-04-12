export default function StartupLoading() {
  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 w-28 rounded-lg" style={{ background: "#1a1a1a" }} />
        <div className="h-8 w-14 rounded-lg" style={{ background: "#1a1a1a" }} />
      </div>
      <div className="rounded-xl p-5 space-y-5" style={{ background: "#111111", border: "1px solid #1f1f1f" }}>
        <div className="space-y-2">
          <div className="h-5 w-40 rounded" style={{ background: "#1a1a1a" }} />
          <div className="h-4 w-48 rounded" style={{ background: "#1a1a1a" }} />
        </div>
        {[120, 200, 80, 100].map((w, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 rounded" style={{ background: "#1a1a1a" }} />
            <div className="h-4 rounded" style={{ background: "#1a1a1a", width: `${w}px` }} />
          </div>
        ))}
      </div>
    </div>
  )
}
