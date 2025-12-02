import { generateObject } from "ai"
import { z } from "zod"

const colorPromptSchema = z.object({
  prompt: z.string().describe("A fun, creative drawing prompt for kids"),
  colors: z.array(z.string()).length(4).describe("4 hex color codes that match the prompt"),
})

export async function POST() {
  try {
    const { object } = await generateObject({
      model: "openai/gpt-5-mini",
      schema: colorPromptSchema,
      temperature: 0.9,
      maxOutputTokens: 200,
      messages: [
        {
          role: "system",
          content: `Generate creative drawing prompts for kids about pocket creatures.

Rules:
- Simple, encouraging language
- Focus on imagination and creativity
- Include creature types, scenes, or activities
- Suggest 4 complementary hex colors
- Make prompts fun and achievable

Examples:
- "Draw a water creature having a pool party!"
- "Create a fire creature roasting marshmallows!"
- "Design your own electric creature playing with friends!"`,
        },
        {
          role: "user",
          content: "Give me a fun drawing idea!",
        },
      ],
    })

    return Response.json(object)
  } catch (error) {
    console.error("Color prompt error:", error)
    return Response.json({
      prompt: "Draw a friendly creature exploring a magical forest!",
      colors: ["#4ECDC4", "#FFE66D", "#95E1D3", "#FF6B35"],
    })
  }
}
