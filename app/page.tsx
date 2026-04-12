import Link from "next/link"

// Sample cards that mirror the exact look of the real OpportunityCard
function PreviewCard({
  platform, platformLabel, color, destination, title, body,
}: {
  platform: string; platformLabel: string; color: string; destination: string; title: string; body: string;
}) {
  return (
    <div style={{
      background: "#0a0a0a", border: "1px solid #181818",
      borderLeft: `3px solid ${color}`, borderRadius: 12,
    }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid #111", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: "0.01em" }}>{platformLabel}</span>
        <span style={{ color: "#252525" }}>·</span>
        <span style={{ color: "#3a3a3a", fontSize: 11 }}>{destination}</span>
      </div>
      <div style={{ padding: "12px 14px", borderBottom: "1px solid #111" }}>
        <p style={{ color: "#dedede", fontSize: 12, fontWeight: 600, lineHeight: 1.45, marginBottom: 6 }}>{title}</p>
        <p style={{ color: "#444", fontSize: 12, lineHeight: 1.55 }}>{body}</p>
      </div>
      <div style={{ padding: "8px 14px", display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ background: "#111", color: "#555", fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid #1a1a1a" }}>Copy</span>
        <span style={{ background: "#111", color: "#555", fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid #1a1a1a" }}>Open ↗</span>
        <span style={{ marginLeft: "auto", background: "rgba(34,197,94,0.07)", color: "#22c55e", fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid rgba(34,197,94,0.12)" }}>Mark done</span>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div style={{ background: "#060606", color: "#efefef", minHeight: "100vh" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid #111",
        background: "rgba(6,6,6,0.88)", backdropFilter: "blur(16px)",
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 26, height: 26, background: "#fff", color: "#000", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, letterSpacing: "-0.02em" }}>LP</div>
            <span style={{ fontWeight: 650, fontSize: 13, color: "#efefef", letterSpacing: "-0.01em" }}>Loudpost</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/login" style={{ fontSize: 13, color: "#444", padding: "6px 14px", borderRadius: 8, fontWeight: 500, textDecoration: "none" }}>
              Sign in
            </Link>
            <Link href="/signup" style={{ fontSize: 13, fontWeight: 600, background: "#fff", color: "#000", padding: "6px 16px", borderRadius: 8, textDecoration: "none" }}>
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

        {/* Left: text */}
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.12)",
            borderRadius: 100, padding: "4px 12px", marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>Free while in beta</span>
          </div>

          <h1 style={{
            fontSize: 52, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05,
            background: "linear-gradient(160deg, #ffffff 30%, #444 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", marginBottom: 20,
          }}>
            14 posts.<br />Every morning.<br />Zero effort.
          </h1>

          <p style={{ fontSize: 16, color: "#555", lineHeight: 1.65, marginBottom: 36, maxWidth: 420 }}>
            Loudpost writes your daily launch posts across Reddit, Twitter, Hacker News, and 8 more platforms — then hands them to you ready to copy and post.
          </p>

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
            <Link href="/signup" style={{
              fontSize: 14, fontWeight: 700, background: "#fff", color: "#000",
              padding: "10px 24px", borderRadius: 10, textDecoration: "none",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
            }}>
              Start for free
            </Link>
            <Link href="/login" style={{
              fontSize: 14, fontWeight: 500, color: "#444", background: "#0f0f0f",
              padding: "10px 24px", borderRadius: 10, border: "1px solid #1a1a1a", textDecoration: "none",
            }}>
              Sign in
            </Link>
          </div>
          <p style={{ fontSize: 12, color: "#2a2a2a" }}>No credit card · 2 minutes to set up</p>
        </div>

        {/* Right: live product preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Mini header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#efefef", letterSpacing: "0.02em" }}>TODAY&apos;S LAUNCH PLAN</p>
              <p style={{ fontSize: 11, color: "#333", marginTop: 2 }}>Saturday, April 12 · Your Startup</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ height: 3, width: 60, background: "#111", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "40%", background: "#fff", borderRadius: 10 }} />
              </div>
              <span style={{ fontSize: 10, color: "#333", fontFamily: "monospace" }}>40%</span>
            </div>
          </div>

          <PreviewCard
            platform="reddit" platformLabel="Reddit" color="#ff6314"
            destination="r/startups"
            title="I built a tool to stop spending hours on startup promotion"
            body="Every week I was manually writing posts for 20 communities. Took hours. Built this to automate it — 14 posts written for me every morning."
          />
          <PreviewCard
            platform="twitter" platformLabel="Twitter / X" color="#1d9bf0"
            destination="@twitter"
            title=""
            body="Been building in public for 3 months. Finally automated the boring part — daily community posts written by AI. #buildinpublic #indiehacker"
          />
          <PreviewCard
            platform="hacker_news" platformLabel="Hacker News" color="#f97316"
            destination="Show HN"
            title="Show HN: Loudpost – AI writes your daily community posts"
            body="I got tired of spending Sunday nights writing the same post 15 different ways for different communities. So I built this."
          />

          {/* Fade at bottom */}
          <div style={{ height: 60, background: "linear-gradient(to bottom, transparent, #060606)", marginTop: -60, position: "relative", zIndex: 1, pointerEvents: "none" }} />
        </div>
      </section>

      {/* ── Platform strip ── */}
      <div style={{ borderTop: "1px solid #0f0f0f", borderBottom: "1px solid #0f0f0f", background: "#050505" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 24px" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#2a2a2a", textAlign: "center", marginBottom: 16, textTransform: "uppercase" }}>Posts go to</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {[
              { name: "Reddit", color: "#ff6314" },
              { name: "Twitter / X", color: "#1d9bf0" },
              { name: "Indie Hackers", color: "#22c55e" },
              { name: "Hacker News", color: "#f97316" },
              { name: "dev.to", color: "#a855f7" },
              { name: "Medium", color: "#aaa" },
              { name: "Product Hunt", color: "#da552f" },
              { name: "BetaList", color: "#ec4899" },
              { name: "Peerlist", color: "#10b981" },
            ].map((p) => (
              <span key={p.name} style={{
                fontSize: 12, fontWeight: 500, padding: "5px 14px", borderRadius: 100,
                color: p.color, background: `${p.color}12`, border: `1px solid ${p.color}22`,
              }}>{p.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "96px 24px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#333", textAlign: "center", marginBottom: 12, textTransform: "uppercase" }}>How it works</p>
        <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", textAlign: "center", color: "#efefef", marginBottom: 64 }}>
          Set up once. Post every day.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
          {[
            { n: "01", title: "Describe your startup", body: "Name, description, what makes it different. AI extracts the right keywords automatically — no manual tagging required." },
            { n: "02", title: "We build your community pool", body: "Loudpost scans Reddit, scores every subreddit for relevance, and verifies which ones actually allow self-promotion." },
            { n: "03", title: "Get 14 posts every morning", body: "Fresh AI-written posts across all platforms, ready to copy and paste. Takes 2 minutes to post them all." },
          ].map(({ n, title, body }) => (
            <div key={n}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: "#0a0a0a",
                border: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#333", marginBottom: 20,
              }}>{n}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#efefef", marginBottom: 8, letterSpacing: "-0.01em" }}>{title}</h3>
              <p style={{ fontSize: 13, color: "#444", lineHeight: 1.65 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What's in your daily plan ── */}
      <section style={{ background: "#040404", borderTop: "1px solid #0f0f0f", borderBottom: "1px solid #0f0f0f" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "96px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#333", marginBottom: 12, textTransform: "uppercase" }}>Your daily plan</p>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: "#efefef", lineHeight: 1.1, marginBottom: 20 }}>
              14 slots.<br />8 platforms.<br />One click each.
            </h2>
            <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>
              Subreddits rotate every 14 days so you never repeat. Posts are written fresh each morning — not templated, not repeated.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { label: "Reddit", detail: "8 subreddits · rotates daily", color: "#ff6314", count: "×8" },
              { label: "Twitter / X", detail: "2 tweets · different angles each day", color: "#1d9bf0", count: "×2" },
              { label: "Founder", detail: "Indie Hackers or Hacker News · alternates", color: "#22c55e", count: "×1" },
              { label: "Blog", detail: "dev.to, Hashnode, or Medium · cycles weekly", color: "#a855f7", count: "×1" },
              { label: "Directories", detail: "2 of 7 platforms · full cycle per week", color: "#f59e0b", count: "×2" },
            ].map(({ label, detail, color, count }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "#080808", border: "1px solid #111", borderLeft: `3px solid ${color}`,
                borderRadius: 10, padding: "12px 16px",
              }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#efefef" }}>{label}</span>
                  <span style={{ fontSize: 12, color: "#333", marginLeft: 10 }}>{detail}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "monospace", background: `${color}10`, padding: "2px 8px", borderRadius: 6 }}>{count}</span>
              </div>
            ))}
            <div style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", borderTop: "1px solid #0f0f0f", marginTop: 4 }}>
              <span style={{ fontSize: 12, color: "#333" }}>Total per day</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#efefef", fontFamily: "monospace" }}>14 posts</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
        <div style={{
          background: "#0a0a0a", border: "1px solid #161616", borderRadius: 20,
          padding: "56px 48px", boxShadow: "0 0 80px rgba(0,0,0,0.6)",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.12)",
            borderRadius: 100, padding: "4px 12px", marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>100% free while in beta</span>
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", color: "#efefef", marginBottom: 12 }}>
            Start today
          </h2>
          <p style={{ fontSize: 14, color: "#444", marginBottom: 32, lineHeight: 1.6 }}>
            Add your startup, get your first daily plan in minutes.
          </p>
          <Link href="/signup" style={{
            display: "inline-block", fontSize: 14, fontWeight: 700,
            background: "#fff", color: "#000", padding: "12px 32px", borderRadius: 12,
            textDecoration: "none", boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
          }}>
            Create your free account →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid #0d0d0d", padding: "24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 20, height: 20, background: "#fff", color: "#000", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800 }}>LP</div>
            <span style={{ fontSize: 12, color: "#222", fontWeight: 500 }}>Loudpost</span>
          </div>
          <p style={{ fontSize: 11, color: "#1e1e1e" }}>Free while in beta · Built for founders</p>
        </div>
      </footer>
    </div>
  )
}
