import { PageWrapper } from "@/components/page-wrapper"
import { GamesHub } from "@/components/games-hub"

export default function GamesPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Fun & Games</h1>
        <p className="text-muted-foreground">Play exciting games and learn amazing facts!</p>
      </div>
      <GamesHub />
    </PageWrapper>
  )
}
