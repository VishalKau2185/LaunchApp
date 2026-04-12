import { getAIClient } from "./client"

interface ClassificationResult {
  self_promo_allowed: boolean
  links_allowed: boolean
  confidence: number
}

export async function classifyCommunity(
  subredditName: string,
  rulesText: string,
  recentPostTitles: string[]
): Promise<ClassificationResult> {
  const client = getAIClient()

  const postsContext =
    recentPostTitles.length > 0
      ? `\nRecent post titles (for context):\n${recentPostTitles.slice(0, 10).join("\n")}`
      : ""

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    tools: [
      {
        name: "classify_subreddit",
        description: "Classify whether a subreddit allows self-promotion",
        input_schema: {
          type: "object" as const,
          properties: {
            self_promo_allowed: {
              type: "boolean",
              description: "Whether posting your own project/tool is allowed",
            },
            links_allowed: {
              type: "boolean",
              description: "Whether external links are allowed in posts",
            },
            confidence: {
              type: "number",
              description: "Confidence score from 0 to 1",
            },
          },
          required: ["self_promo_allowed", "links_allowed", "confidence"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "classify_subreddit" },
    messages: [
      {
        role: "user",
        content: `Analyze r/${subredditName} and determine if it allows self-promotion (sharing your own product/tool/project).

Rules:
${rulesText || "No rules found."}${postsContext}

Consider: Many subreddits have specific "Share your project" or "Show HN" style threads. If the community seems open to builders sharing their work (even occasionally), mark as allowed.`,
      },
    ],
  })

  const toolUse = response.content.find((c) => c.type === "tool_use")
  if (!toolUse || toolUse.type !== "tool_use") {
    return { self_promo_allowed: false, links_allowed: false, confidence: 0 }
  }

  return toolUse.input as ClassificationResult
}
