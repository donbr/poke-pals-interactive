import { generateObject } from "ai"
import { z } from "zod"

const storyResponseSchema = z.object({
  text: z.string().describe("The story paragraph (2-4 sentences)"),
  choices: z.array(z.string()).length(3).describe("3 choices for what happens next"),
})

export async function POST(req: Request) {
  const { action, heroName, creatureType, setting, previousStory, choice } = await req.json()

  try {
    if (action === "start") {
      const { object } = await generateObject({
        model: "openai/gpt-5-mini",
        schema: storyResponseSchema,
        temperature: 0.8,
        maxOutputTokens: 400,
        messages: [
          {
            role: "system",
            content: `You are a storyteller for kids. Create magical, safe, encouraging adventures.

Rules:
- Use simple language (grade 2-4)
- Keep paragraphs short (2-4 sentences)
- Focus on friendship, bravery, and kindness
- No scary or violent content
- Include the creature type naturally
- Give 3 interesting choices
- Make the hero feel special
- No copyrighted characters`,
          },
          {
            role: "user",
            content: `Start a story where ${heroName} meets a ${creatureType} creature in a ${setting}. Make it magical and fun!`,
          },
        ],
      })

      return Response.json(object)
    } else {
      const { object } = await generateObject({
        model: "openai/gpt-5-mini",
        schema: storyResponseSchema,
        temperature: 0.8,
        maxOutputTokens: 400,
        messages: [
          {
            role: "system",
            content: `Continue the kid-friendly adventure story. Keep it magical and encouraging.

Rules:
- Build on what happened before
- Use simple language (grade 2-4)
- 2-4 sentences per response
- Focus on friendship and bravery
- No scary content
- Give 3 new choices
- Keep it exciting but safe`,
          },
          {
            role: "user",
            content: `Story so far:\n${previousStory}\n\n${heroName} chose: "${choice}"\n\nContinue the adventure!`,
          },
        ],
      })

      return Response.json(object)
    }
  } catch (error) {
    console.error("Story generation error:", error)
    return Response.json({
      text: `${heroName} looked around with wonder. Something magical was about to happen...`,
      choices: ["Look for clues", "Call out hello", "Follow the sparkles"],
    })
  }
}
