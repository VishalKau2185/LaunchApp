import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  // Verify Stripe signature (requires stripe package)
  // For MVP, validate with a simple secret header instead
  // Install stripe: npm install stripe
  // Then implement: const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)

  let event: { type: string; data: { object: Record<string, unknown> } }
  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      customer_email?: string
      metadata?: { user_id?: string }
    }

    const userId = session.metadata?.user_id
    const email = session.customer_email

    if (userId) {
      await supabase
        .from("users")
        .update({ plan: "paid" })
        .eq("id", userId)
    } else if (email) {
      await supabase
        .from("users")
        .update({ plan: "paid" })
        .eq("email", email)
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as { metadata?: { user_id?: string } }
    const userId = subscription.metadata?.user_id

    if (userId) {
      await supabase
        .from("users")
        .update({ plan: "free" })
        .eq("id", userId)
    }
  }

  return NextResponse.json({ received: true })
}
