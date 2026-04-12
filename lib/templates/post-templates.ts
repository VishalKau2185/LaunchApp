export type TemplateType =
  | "classic_i_built"
  | "short_launch"
  | "frustration"
  | "numbers"
  | "simple_utility"
  | "question"

export interface PostTemplate {
  type: TemplateType
  name: string
  // Prompt fragment telling Claude how to write this style
  redditStyle: string
  twitterStyle: string
  founderStyle: string
}

export const POST_TEMPLATES: PostTemplate[] = [
  {
    type: "classic_i_built",
    name: "Classic I Built",
    redditStyle: `Write a short Reddit post in the "I built X" style.
Title format: "I built [specific thing] that [specific benefit]"
Body: 4-6 lines max. Start with "I kept running into [problem], so I made something to fix it." Then one sentence on what it does. Then "Still early but it's been useful so far." End with a short feedback ask. Put the link on its own line at the bottom if a website exists.`,
    twitterStyle: `Tweet in first person. "I built [X] — [one-line benefit]. [Link]" Then 2-3 hashtags. Max 240 chars total.`,
    founderStyle: `Write a short founder post. "I built [X] because I kept hitting [problem]." 3-5 sentences. Casual and direct. Ask for feedback at the end.`,
  },
  {
    type: "short_launch",
    name: "Short Launch",
    redditStyle: `Write a very short Reddit post. Title: "Built this over the weekend" or similar.
Body: 3-4 lines only. One sentence on what it is. "Still rough but useful." Ask what people think. Put link on its own line at the bottom.`,
    twitterStyle: `Short casual tweet. "Just shipped [X]. It [simple description]. Curious what you think. [link]" Add 2 hashtags. Under 230 chars.`,
    founderStyle: `Short milestone post. "Launched [X] this week." What it does in one line. What you learned. Ask for feedback.`,
  },
  {
    type: "frustration",
    name: "Frustration Based",
    redditStyle: `Write a Reddit post starting from a real frustration.
Title: "I was frustrated with [problem], so I built this"
Body: "Made a small tool that [solution]." One more sentence of context. "Would love honest feedback." Put link at bottom. Max 5 lines.`,
    twitterStyle: `Tweet: "Got tired of [problem] so I built [X]. [short description] [link]" Add 2-3 hashtags. Under 240 chars.`,
    founderStyle: `Write from a real frustration angle. What problem drove you to build this. What the solution is. Keep it conversational.`,
  },
  {
    type: "numbers",
    name: "Numbers / Value",
    redditStyle: `Write a Reddit post with a specific value prop or number in the title.
Title: "I built [tool] — [specific number/metric/value proposition]"
Body: "[Problem] was taking me [time/effort]. Built something that [specific fix]." Short. Ask for feedback. Link at bottom. Max 5 lines.`,
    twitterStyle: `Tweet with a specific stat or value: "[X] saves [specific thing]. Built it because [problem]. [link]" 2 hashtags. Under 240 chars.`,
    founderStyle: `Lead with a number or specific outcome. "[X] does [Y] in [Z]." Real metrics or real time savings. Ask for feedback.`,
  },
  {
    type: "simple_utility",
    name: "Simple Utility",
    redditStyle: `Write a humble Reddit post about a small useful thing you made.
Title: "Made a small tool to [simple benefit]"
Body: "Built this for myself but figured others might find it useful." One sentence on what it does. "Still early." Short feedback ask. Link at bottom. Max 4 lines.`,
    twitterStyle: `"Made a small [X] for [use case]. Nothing fancy but it's useful. [link]" 2 hashtags. Casual tone. Under 230 chars.`,
    founderStyle: `Humble utility post. You built something for yourself. Simple. Useful. Other people might want it too.`,
  },
  {
    type: "question",
    name: "Question Hook",
    redditStyle: `Write a Reddit post starting with a relatable question.
Title: "Does anyone else struggle with [problem]?"
Body: "I built a small tool to fix it. [One sentence on what it does.] Still early, but it's been useful for me. Curious if this would be useful to others. [link]" Max 4 lines.`,
    twitterStyle: `"Anyone else dealing with [problem]? Built something small to fix it. [link]" Add 2-3 hashtags. Under 230 chars.`,
    founderStyle: `Open with the question your target user asks. Then introduce the tool as your solution. Conversational.`,
  },
]

export function getTemplateForSlot(slotIndex: number): PostTemplate {
  const dayOfYear = Math.floor(Date.now() / 86400000)
  const index = (dayOfYear + slotIndex) % POST_TEMPLATES.length
  return POST_TEMPLATES[index]
}
