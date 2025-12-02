"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

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

export function FeaturedPokemon() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRandomPokemon = async () => {
    setLoading(true)
    try {
      const ids = Array.from({ length: 3 }, () => Math.floor(Math.random() * 151) + 1)
      const responses = await Promise.all(
        ids.map((id) => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((r) => r.json())),
      )
      setPokemon(responses)
    } catch (error) {
      console.error("Failed to fetch Pokemon:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRandomPokemon()
  }, [])

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary animate-sparkle" />
          <h2 className="text-2xl font-bold text-foreground">Featured Friends</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchRandomPokemon} disabled={loading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          New Friends
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="w-32 h-32 mx-auto bg-muted rounded-full mb-4" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
              </Card>
            ))
          : pokemon.map((p, i) => (
              <Card
                key={p.id}
                className="p-6 hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-primary/30"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={p.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
                    alt={p.name}
                    fill
                    className="object-contain animate-float"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                </div>
                <h3 className="font-bold text-xl text-center capitalize mb-2">{p.name}</h3>
                <div className="flex justify-center gap-2">
                  {p.types.map((t) => (
                    <span
                      key={t.type.name}
                      className={`${typeColors[t.type.name] || "bg-gray-400"} text-white text-xs px-3 py-1 rounded-full font-semibold capitalize`}
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
      </div>
    </section>
  )
}
