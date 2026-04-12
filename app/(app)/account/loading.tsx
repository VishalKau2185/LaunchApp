export default function AccountLoading() {
  return (
    <div className="p-6 max-w-xl mx-auto space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-24 rounded-lg" style={{ background: "#1a1a1a" }} />
        <div className="h-4 w-40 rounded" style={{ background: "#1a1a1a" }} />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl p-5 space-y-4" style={{ background: "#111111", border: "1px solid #1f1f1f" }}>
          <div className="h-4 w-24 rounded" style={{ background: "#1a1a1a" }} />
          <div className="h-10 w-full rounded-lg" style={{ background: "#1a1a1a" }} />
        </div>
      ))}
    </div>
  )
}
