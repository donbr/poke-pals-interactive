import { PageWrapper } from "@/components/page-wrapper"
import { HomeHero } from "@/components/home-hero"
import { QuickActions } from "@/components/quick-actions"
import { FeaturedPokemon } from "@/components/featured-pokemon"

export default function HomePage() {
  return (
    <PageWrapper>
      <HomeHero />
      <QuickActions />
      <FeaturedPokemon />
    </PageWrapper>
  )
}
