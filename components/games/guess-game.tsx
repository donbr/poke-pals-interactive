"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, XCircle, Eye } from "lucide-react"
import Image from "next/image"

interface GuessGameProps {
  onBack: () => void
}

interface Pokemon {
  id: number
  name: string
  sprites: { other: { "official-artwork": { front_default: string } } }
  types: Array<{ type: { name: string } }>
}

export function GuessGame({ onBack }: GuessGameProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [hints, setHints] = useState<string[]>([])
  const [currentHint, setCurrentHint] = useState(0)
  const [guess, setGuess] = useState("")
  const [result, setResult] = useState<"correct" | "wrong" | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingHint, setLoadingHint] = useState(false)
  const [score, setScore] = useState(0)

  const startNewRound = async () => {
    setLoading(true)
    setResult(null)
    setRevealed(false)
    setGuess("")
    setHints([])
    setCurrentHint(0)

    try {
      const randomId = Math.floor(Math.random() * 151) + 1
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
      const data = await res.json()
      setPokemon(data)

      // Generate hints
      await generateHints(data)
    } catch (error) {
      console.error("Failed to start game:", error)
    }
    setLoading(false)
  }

  const generateHints = async (poke: Pokemon) => {
    setLoadingHint(true)
    try {
      const res = await fetch("/api/llm/game-hints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: poke.name,
          types: poke.types.map((t) => t.type.name),
          id: poke.id,
        }),
      })
      const data = await res.json()
      setHints(data.hints || [])
    } catch (error) {
      setHints([
        `This creature is a ${poke.types.map((t) => t.type.name).join("/")} type!`,
        `It's number ${poke.id} in the collection!`,
        `Its name has ${poke.name.length} letters!`,
      ])
    }
    setLoadingHint(false)
  }

  useEffect(() => {
    startNewRound()
  }, [])

  const handleGuess = () => {
    if (!pokemon || !guess.trim()) return

    if (guess.toLowerCase() === pokemon.name.toLowerCase()) {
      setResult("correct")
      setScore((s) => s + Math.max(10 - currentHint * 2, 2))
      setRevealed(true)
    } else {
      setResult("wrong")
    }
  }

  const showNextHint = () => {
    if (currentHint < hints.length - 1) {
      setCurrentHint((h) => h + 1)
    }
  }

  const giveUp = () => {
    setRevealed(true)
    setResult("wrong")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Button>
        <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-bold">Score: {score}</span>
        </div>
      </div>

      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-6">Who&apos;s That Creature?</h2>

        {loading ? (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Finding a mystery creature...</p>
          </div>
        ) : (
          <>
            {/* Silhouette or revealed image */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              {pokemon && (
                <Image
                  src={pokemon.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
                  alt="Mystery creature"
                  fill
                  className={`object-contain transition-all duration-500 ${revealed ? "" : "brightness-0"}`}
                />
              )}
            </div>

            {/* Hints */}
            <div className="space-y-2 mb-6">
              {loadingHint ? (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating hints...
                </div>
              ) : (
                hints.slice(0, currentHint + 1).map((hint, i) => (
                  <div key={i} className="bg-muted px-4 py-2 rounded-lg text-sm">
                    <span className="font-semibold">Hint {i + 1}:</span> {hint}
                  </div>
                ))
              )}
            </div>

            {/* Result display */}
            {result && (
              <div
                className={`flex items-center justify-center gap-2 mb-4 text-lg font-bold ${
                  result === "correct" ? "text-green-500" : "text-red-500"
                }`}
              >
                {result === "correct" ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    Correct! It&apos;s {pokemon?.name}!
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6" />
                    {revealed ? `It was ${pokemon?.name}!` : "Try again!"}
                  </>
                )}
              </div>
            )}

            {/* Input and buttons */}
            {!revealed ? (
              <div className="space-y-4">
                <div className="flex gap-2 max-w-md mx-auto">
                  <Input
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                    placeholder="Enter your guess..."
                    className="h-12 text-center text-lg rounded-full"
                  />
                  <Button onClick={handleGuess} className="rounded-full px-6 h-12">
                    Guess!
                  </Button>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={showNextHint}
                    disabled={currentHint >= hints.length - 1}
                    className="rounded-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    More Hints
                  </Button>
                  <Button variant="ghost" onClick={giveUp} className="rounded-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Reveal
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={startNewRound} size="lg" className="rounded-full px-8">
                Play Again!
              </Button>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
