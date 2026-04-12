import { getAIClient } from "./client"

export async function extractKeywords(description: string): Promise<string[]> {
  const client = getAIClient()

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    tools: [
      {
        name: "extract_keywords",
        description: "Extract keywords from a startup description",
        input_schema: {
          type: "object" as const,
          properties: {
            keywords: {
              type: "array",
              items: { type: "string" },
              description: "5-10 keywords that describe this startup's niche, audience, and problem space. Include both specific (e.g. 'music production') and general (e.g. 'SaaS') terms.",
            },
          },
          required: ["keywords"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "extract_keywords" },
    messages: [
      {
        role: "user",
        content: `Extract keywords from this startup description to help find relevant online communities:\n\n"${description}"`,
      },
    ],
  })

  const toolUse = response.content.find((c) => c.type === "tool_use")
  if (!toolUse || toolUse.type !== "tool_use") return []

  const input = toolUse.input as { keywords: string[] }
  return input.keywords.slice(0, 10)
}
