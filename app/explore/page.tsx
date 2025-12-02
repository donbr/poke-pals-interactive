import { PageWrapper } from "@/components/page-wrapper"
import { PokemonExplorer } from "@/components/pokemon-explorer"

export default function ExplorePage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Explore Creatures</h1>
        <p className="text-muted-foreground">Search for your favorite pocket monsters or ask in natural language!</p>
      </div>
      <PokemonExplorer />
    </PageWrapper>
  )
}
