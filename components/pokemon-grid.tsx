"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Loader2, ChevronDown } from "lucide-react"
import { PokemonDetailModal } from "./pokemon-detail-modal"

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

interface PokemonGridProps {
  searchQuery?: string
  selectedType?: string | null
  pokemonIds?: number[]
}

export function PokemonGrid({ searchQuery = "", selectedType, pokemonIds }: PokemonGridProps) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const limit = 20

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true)
      try {
        if (pokemonIds && pokemonIds.length > 0) {
          // Fetch specific Pokemon by IDs
          const responses = await Promise.all(
            pokemonIds.map((id) => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((r) => r.json())),
          )
          setPokemon(responses)
        } else if (selectedType) {
          // Fetch by type
          const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`)
          const typeData = await typeRes.json()
          const pokemonUrls = typeData.pokemon
            .slice(0, limit * page)
            .map((p: { pokemon: { url: string } }) => p.pokemon.url)
          const responses = await Promise.all(pokemonUrls.map((url: string) => fetch(url).then((r) => r.json())))
          setPokemon(responses)
        } else {
          // Fetch paginated list
          const listRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit * page}&offset=0`)
          const listData = await listRes.json()
          const responses = await Promise.all(
            listData.results.map((p: { url: string }) => fetch(p.url).then((r) => r.json())),
          )
          setPokemon(responses)
        }
      } catch (error) {
        console.error("Failed to fetch Pokemon:", error)
      }
      setLoading(false)
    }

    fetchPokemon()
  }, [selectedType, page, pokemonIds])

  // Filter by search query
  const filteredPokemon = pokemon.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading && pokemon.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading amazing creatures...</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredPokemon.map((p) => (
          <Card
            key={p.id}
            onClick={() => setSelectedPokemon(p)}
            className="p-4 hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-primary/30 group"
          >
            <div className="relative w-full aspect-square mb-2">
              <Image
                src={p.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
                alt={p.name}
                fill
                className="object-contain group-hover:animate-bounce-gentle"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">#{String(p.id).padStart(3, "0")}</p>
            <h3 className="font-bold text-center capitalize mb-2">{p.name}</h3>
            <div className="flex justify-center gap-1 flex-wrap">
              {p.types.map((t) => (
                <span
                  key={t.type.name}
                  className={`${typeColors[t.type.name] || "bg-gray-400"} text-white text-xs px-2 py-0.5 rounded-full font-medium capitalize`}
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {!pokemonIds && filteredPokemon.length >= limit * page && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setPage((p) => p + 1)}
            variant="outline"
            size="lg"
            className="rounded-full gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
            Load More
          </Button>
        </div>
      )}

      <PokemonDetailModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
    </>
  )
}
