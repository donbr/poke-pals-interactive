"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Loader2, Sparkles, Heart } from "lucide-react"

interface Pokemon {
  id: number
  name: string
  sprites: {
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
  types: Array<{ type: { name: string } }>
  height: number
  weight: number
}

const typeColors: Record<string, string> = {
  fire: "bg-orange-400",
  water: "bg-blue-400",
  grass: "bg-green-400",
  electric: "bg-yellow-400",
  psychic: "bg-pink-400",
  ice: "bg-cyan-300",
  dragon: "bg-indigo-500",
  fairy: "bg-pink-300",
  normal: "bg-gray-400",
  fighting: "bg-red-500",
  flying: "bg-sky-300",
  poison: "bg-purple-400",
  ground: "bg-amber-600",
  rock: "bg-stone-500",
  bug: "bg-lime-500",
  ghost: "bg-purple-600",
  steel: "bg-slate-400",
  dark: "bg-gray-700",
}

interface PokemonDetailModalProps {
  pokemon: Pokemon | null
  onClose: () => void
}

export function PokemonDetailModal({ pokemon, onClose }: PokemonDetailModalProps) {
  const [funFact, setFunFact] = useState("")
  const [loadingFact, setLoadingFact] = useState(false)

  useEffect(() => {
    if (pokemon) {
      generateFunFact()
    }
  }, [pokemon])

  const generateFunFact = async () => {
    if (!pokemon) return

    setLoadingFact(true)
    try {
      const response = await fetch("/api/llm/fun-fact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pokemon.name,
          types: pokemon.types.map((t) => t.type.name),
        }),
      })
      const data = await response.json()
      setFunFact(data.fact)
    } catch (error) {
      setFunFact("This creature is full of mysteries waiting to be discovered!")
    }
    setLoadingFact(false)
  }

  if (!pokemon) return null

  return (
    <Dialog open={!!pokemon} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold capitalize text-center">{pokemon.name}</DialogTitle>
        </DialogHeader>

        <div className="relative w-48 h-48 mx-auto">
          <Image
            src={pokemon.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
            alt={pokemon.name}
            fill
            className="object-contain animate-float"
          />
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className={`${typeColors[t.type.name] || "bg-gray-400"} text-white px-4 py-1 rounded-full font-semibold capitalize`}
            >
              {t.type.name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Height</p>
            <p className="text-xl font-bold">{pokemon.height / 10} m</p>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Weight</p>
            <p className="text-xl font-bold">{pokemon.weight / 10} kg</p>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="bg-primary/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">Fun Fact</span>
          </div>
          {loadingFact ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating fun fact...
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{funFact}</p>
          )}
        </div>

        <Button
          variant="outline"
          className="w-full rounded-full gap-2 mt-2 bg-transparent"
          onClick={generateFunFact}
          disabled={loadingFact}
        >
          <Heart className="w-4 h-4" />
          Get Another Fun Fact
        </Button>
      </DialogContent>
    </Dialog>
  )
}
