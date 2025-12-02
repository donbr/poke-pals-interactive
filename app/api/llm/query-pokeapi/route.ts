import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const searchFiltersSchema = z.object({
  types: z.array(z.string()).describe("Pokemon types like fire, water, grass, electric, etc."),
  traits: z.array(z.string()).describe("Descriptive traits like cute, small, fast, friendly, scary"),
  pokemonIds: z.array(z.number()).describe("Specific Pokemon IDs (1-151 for original) that match the description"),
})

export async function POST(req: Request) {
  const { query } = await req.json()

  try {
    const { object } = await generateObject({
      model: openai("gpt-5-nano"),
      schema: searchFiltersSchema,
      maxOutputTokens: 3000,
      messages: [
        {
          role: "system",
          content: `You are a helpful Pokemon search assistant for kids. Convert natural language queries into structured Pokemon search criteria.
          
Rules:
- Only suggest Pokemon from the original 151 (IDs 1-151)
- Focus on kid-friendly, positive descriptions
- Match traits to actual Pokemon characteristics
- Return 5-10 Pokemon IDs that best match the query
- Consider type, size, appearance, and personality

Example mappings:
- "cute and small" → Pikachu (25), Jigglypuff (39), Eevee (133)
- "looks scary" → Gengar (94), Haunter (93), Gyarados (130)
- "can fly" → Pidgeot (18), Charizard (6), Dragonite (149)
- "purple" → Gengar (94), Nidoking (34), Rattata (19)
- "friendly" → Pikachu (25), Chansey (113), Clefairy (35)`,
        },
        {
          role: "user",
          content: query,
        },
      ],
    })

    return Response.json(object)
  } catch (error) {
    console.error("Query parsing error:", error)
    // Fallback to random selection if AI fails
    const uniqueIds = new Set<number>()
    while (uniqueIds.size < 6) {
      uniqueIds.add(Math.floor(Math.random() * 151) + 1)
    }
    const randomIds = Array.from(uniqueIds)
    return Response.json({ types: [], traits: [], pokemonIds: randomIds })
  }
}
