import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AccountForm from "./AccountForm"

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div style={{ borderBottom: "1px solid #111", paddingBottom: 20, marginBottom: 28 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#2a2a2a", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6 }}>
          Settings
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: "#efefef" }}>Account</h1>
        <p style={{ fontSize: 13, color: "#444", marginTop: 6 }}>Manage your password and account data</p>
      </div>

      <AccountForm email={user.email ?? ""} />
    </div>
  )
}
