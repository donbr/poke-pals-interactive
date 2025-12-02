import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const hintsSchema = z.object({
  hints: z.array(z.string()).length(3).describe("Three progressively revealing hints about the creature"),
})

export async function POST(req: Request) {
  const { name, types, id } = await req.json()

  try {
    const { object } = await generateObject({
      model: openai("gpt-5-nano"),
      schema: hintsSchema,
      maxOutputTokens: 3000,
      messages: [
        {
          role: "system",
          content: `Generate 3 fun hints for kids to guess a creature. Rules:
- First hint: Very vague (personality or habitat)
- Second hint: More specific (type or abilities)  
- Third hint: Almost gives it away (appearance)
- Use simple words (grade 2-4)
- Be playful and fun
- Don't say the name!`,
        },
        {
          role: "user",
          content: `Create hints for: ${name} (${types.join("/")} type, #${id})`,
        },
      ],
    })

    return Response.json(object)
  } catch (error) {
    console.error("Hints generation error:", error)
    return Response.json({
      hints: [
        `This creature is a ${types.join("/")} type!`,
        `It's number ${id} in the collection!`,
        `Its name starts with "${name[0].toUpperCase()}"!`,
      ],
    })
  }
}
