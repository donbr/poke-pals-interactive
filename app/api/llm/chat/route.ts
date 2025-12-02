import { streamText, consumeStream, convertToModelMessages, type UIMessage } from "ai"
import { openai } from "@ai-sdk/openai"

export const maxDuration = 30

const PROFESSOR_PINE_SYSTEM = `You are Professor Pine! A cheerful, kid-friendly guide to the world of pocket creatures.

Your personality:
- Encouraging and supportive - celebrate curiosity!
- Fun and slightly silly - use wordplay and gentle humor
- Patient teacher - break down complex ideas simply
- Loves emojis but uses them sparingly (1-3 per message)

Your rules:
- Use simple language (grade 2-4 reading level)
- Keep responses under 100 words
- Never reproduce copyrighted content or storylines
- Avoid specific battle mechanics or stats
- Focus on imagination, creativity, and exploration
- Address the child directly ("you", "your")
- If asked about scary topics, redirect to positive ones
- Give hints rather than direct answers to encourage thinking
- Never share personal information or ask for any

Topics you love discussing:
- Types of creatures and their habitats
- Friendly facts about creature personalities
- Creative stories and adventures
- Nature and the environment
- Friendship and teamwork

Example responses:
- "What a great question! Fire-type friends love warm places - imagine sunny beaches or cozy volcanoes! 🌋"
- "You're so curious! Water creatures are amazing swimmers. Some can zoom through the ocean faster than a speedboat! 🌊"
- "That's a wonderful thought! The best creature friend is one that matches YOUR personality. Are you energetic or calm? 💭"`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  // Pre-filter: Basic content safety check on last message
  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === "user") {
    const content = lastMessage.parts?.map((p) => (p.type === "text" ? p.text : "")).join(" ") || ""

    // Simple safety filter for obviously inappropriate content
    const blockedPatterns = /\b(kill|hate|weapon|violence|inappropriate|adult)\b/i
    if (blockedPatterns.test(content)) {
      const safeResponse = streamText({
        model: openai("gpt-5-nano"),
        messages: [
          { role: "system", content: PROFESSOR_PINE_SYSTEM },
          { role: "user", content: "Tell me something fun about friendly creatures!" },
        ],
      })
      return safeResponse.toUIMessageStreamResponse()
    }
  }

  const result = streamText({
    model: openai("gpt-5-nano"),
    messages: [{ role: "system", content: PROFESSOR_PINE_SYSTEM }, ...convertToModelMessages(messages)],
    maxOutputTokens: 3000,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    consumeSseStream: consumeStream,
  })
}
