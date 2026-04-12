import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import OnboardingForm from "./OnboardingForm"

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: startup } = await supabase
    .from("startups")
    .select("name, description, website, category, target_audience, keywords")
    .eq("user_id", user.id)
    .single()

  return (
    <OnboardingForm
      initial={startup ?? null}
    />
  )
}
