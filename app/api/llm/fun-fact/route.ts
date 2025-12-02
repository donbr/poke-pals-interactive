import { generateText } from "ai"

export async function POST(req: Request) {
  const { name, types } = await req.json()

  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      temperature: 0.8,
      maxOutputTokens: 150,
      messages: [
        {
          role: "system",
          content: `You are Professor Pine, a cheerful guide for kids learning about creatures. Generate a single fun, imaginative fact about the creature. 

Rules:
- Use simple language (grade 2-4 reading level)
- Be playful and encouraging
- Keep it to 1-2 sentences
- Focus on imagination, not copyrighted details
- Include emojis sparingly
- Make facts about habitat, personality, or abilities
- Never mention specific game mechanics or stats`,
        },
        {
          role: "user",
          content: `Tell me a fun fact about ${name}, a ${types.join("/")} type creature!`,
        },
      ],
    })

    return Response.json({ fact: text })
  } catch (error) {
    console.error("Fun fact generation error:", error)
    return Response.json({
      fact: `${name} is a wonderful ${types.join(" and ")} type friend who loves making new friends!`,
    })
  }
}
