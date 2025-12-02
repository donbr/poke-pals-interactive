import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const quizSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctIndex: z.number().min(0).max(3),
    }),
  ),
})

export async function POST(req: Request) {
  const { count = 5 } = await req.json()

  try {
    const { object } = await generateObject({
      model: openai("gpt-5-nano"),
      schema: quizSchema,
      maxOutputTokens: 3000,
      messages: [
        {
          role: "system",
          content: `Generate ${count} fun quiz questions about pocket creatures for kids.

Rules:
- Use simple language (grade 2-4 reading level)
- Focus on types, habitats, and fun facts
- Make questions encouraging and positive
- Avoid battle mechanics or complex stats
- Include variety: types, behaviors, appearances
- Each question has exactly 4 options
- Make wrong answers plausible but clearly different

Example topics:
- "Which type is strong against fire?"
- "Where might you find a water creature?"
- "What color are most grass types?"
- "Which creature can fly?"`,
        },
        {
          role: "user",
          content: `Generate ${count} fun questions!`,
        },
      ],
    })

    return Response.json(object)
  } catch (error) {
    console.error("Quiz generation error:", error)
    // Fallback questions
    return Response.json({
      questions: [
        {
          question: "What type is strong against fire?",
          options: ["Water", "Grass", "Electric", "Normal"],
          correctIndex: 0,
        },
        {
          question: "Where might you find a water creature?",
          options: ["In a volcano", "In the ocean", "In the sky", "In a cave"],
          correctIndex: 1,
        },
        {
          question: "What color are most grass types?",
          options: ["Red", "Blue", "Green", "Purple"],
          correctIndex: 2,
        },
        {
          question: "Which type can often fly?",
          options: ["Rock", "Ground", "Flying", "Steel"],
          correctIndex: 2,
        },
        {
          question: "What do electric types often have?",
          options: ["Flames", "Leaves", "Lightning bolts", "Water drops"],
          correctIndex: 2,
        },
      ],
    })
  }
}
