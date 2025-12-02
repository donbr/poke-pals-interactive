"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { HelpCircle, Palette, Trophy } from "lucide-react"
import { GuessGame } from "./games/guess-game"
import { QuizGame } from "./games/quiz-game"
import { ColorPlayground } from "./games/color-playground"

type GameType = "hub" | "guess" | "quiz" | "color"

const games = [
  {
    id: "guess" as const,
    title: "Who's That Creature?",
    description: "Get hints from AI and guess the creature!",
    icon: HelpCircle,
    color: "bg-primary/20 text-primary",
  },
  {
    id: "quiz" as const,
    title: "Fun Quiz",
    description: "Test your knowledge with AI-generated questions!",
    icon: Trophy,
    color: "bg-secondary/40 text-secondary-foreground",
  },
  {
    id: "color" as const,
    title: "Color Playground",
    description: "Get creative drawing prompts from AI!",
    icon: Palette,
    color: "bg-accent/20 text-accent-foreground",
  },
]

export function GamesHub() {
  const [activeGame, setActiveGame] = useState<GameType>("hub")

  if (activeGame === "guess") {
    return <GuessGame onBack={() => setActiveGame("hub")} />
  }

  if (activeGame === "quiz") {
    return <QuizGame onBack={() => setActiveGame("hub")} />
  }

  if (activeGame === "color") {
    return <ColorPlayground onBack={() => setActiveGame("hub")} />
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {games.map((game) => {
        const Icon = game.icon
        return (
          <Card
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className={`p-8 cursor-pointer hover:scale-105 transition-all border-2 border-transparent hover:border-primary/30 ${game.color}`}
          >
            <Icon className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-bold mb-2">{game.title}</h2>
            <p className="text-sm opacity-80">{game.description}</p>
          </Card>
        )
      })}
    </div>
  )
}
