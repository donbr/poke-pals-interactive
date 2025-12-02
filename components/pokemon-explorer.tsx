"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Search, Sparkles, Loader2 } from "lucide-react"
import { PokemonGrid } from "./pokemon-grid"
import { TypeFilter } from "./type-filter"

export function PokemonExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [naturalQuery, setNaturalQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [nlResults, setNlResults] = useState<number[]>([])
  const [nlLoading, setNlLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("browse")

  const handleNaturalSearch = async () => {
    if (!naturalQuery.trim()) return

    setNlLoading(true)
    try {
      const response = await fetch("/api/llm/query-pokeapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: naturalQuery }),
      })
      const data = await response.json()

      // Parse the AI response to get Pokemon IDs
      if (data.pokemonIds) {
        setNlResults(data.pokemonIds)
      }
    } catch (error) {
      console.error("Natural search failed:", error)
    }
    setNlLoading(false)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="browse" className="text-base">
            Browse by Type
          </TabsTrigger>
          <TabsTrigger value="ask" className="text-base gap-2">
            <Sparkles className="w-4 h-4" />
            Ask AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-full border-2"
            />
          </div>

          {/* Type filters */}
          <TypeFilter selectedType={selectedType} onSelectType={setSelectedType} />

          {/* Pokemon grid */}
          <PokemonGrid searchQuery={searchQuery} selectedType={selectedType} />
        </TabsContent>

        <TabsContent value="ask" className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border-2 border-primary/20">
            <h2 className="text-xl font-bold mb-2">Ask me anything!</h2>
            <p className="text-muted-foreground mb-4">
              Try questions like &quot;Show me cute purple creatures&quot; or &quot;Which ones can swim fast?&quot;
            </p>

            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Describe what you're looking for..."
                value={naturalQuery}
                onChange={(e) => setNaturalQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNaturalSearch()}
                className="h-14 text-lg rounded-full border-2 flex-1"
              />
              <Button onClick={handleNaturalSearch} disabled={nlLoading} size="lg" className="rounded-full px-8">
                {nlLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              </Button>
            </div>

            {/* Example queries */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["cute and small", "fire type", "can fly", "looks friendly", "water pokemon"].map((example) => (
                <button
                  key={example}
                  onClick={() => setNaturalQuery(example)}
                  className="bg-muted hover:bg-muted/80 px-3 py-1 rounded-full text-sm text-muted-foreground transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* AI Results */}
          {nlResults.length > 0 && <PokemonGrid pokemonIds={nlResults} />}

          {nlLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Finding the perfect creatures for you...</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
