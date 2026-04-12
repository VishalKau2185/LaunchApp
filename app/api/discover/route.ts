import { NextRequest, NextResponse } from "next/server"
import { createClient, createAdminClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!startup) return NextResponse.json({ error: "No startup found" }, { status: 404 })

  const admin = createAdminClient()

  await admin.from("startups")
    .update({ discovery_status: "complete", updated_at: new Date().toISOString() })
    .eq("id", startup.id)
    .eq("user_id", user.id)

  const today = new Date().toISOString().split("T")[0]
  await admin.from("daily_opportunities").delete().eq("user_id", user.id).eq("date", today)

  return NextResponse.json({ ok: true })
}
