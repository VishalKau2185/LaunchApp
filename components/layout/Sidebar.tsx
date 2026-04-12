"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Rocket, Settings, LogOut } from "lucide-react"
import { signOut } from "@/actions/auth"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/startup",   label: "My Startup", icon: Rocket },
  { href: "/account",   label: "Account",    icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-52 min-h-screen flex flex-col shrink-0"
      style={{ background: "#050505", borderRight: "1px solid #141414" }}
    >
      {/* Logo */}
      <div className="px-4 py-5" style={{ borderBottom: "1px solid #111" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold tracking-tight shrink-0"
            style={{ background: "#ffffff", color: "#000000" }}
          >
            LP
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: "#efefef" }}>Loudpost</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 pt-4 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium relative"
              style={{
                background: isActive ? "#111" : "transparent",
                color:      isActive ? "#efefef" : "#444",
              }}
            >
              {/* Active left accent */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                  style={{ background: "#efefef" }}
                />
              )}
              <Icon
                className="w-4 h-4 shrink-0"
                style={{ color: isActive ? "#efefef" : "#333" }}
              />
              <span style={{ color: isActive ? "#efefef" : "#444" }}>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-2 pb-4" style={{ borderTop: "1px solid #111" }}>
        <form action={signOut} className="mt-3">
          <button
            type="submit"
            className="group w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium"
            style={{ color: "#333" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#666" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#333" }}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
