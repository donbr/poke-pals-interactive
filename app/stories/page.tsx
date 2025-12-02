import { PageWrapper } from "@/components/page-wrapper"
import { StoryBuilder } from "@/components/story-builder"

export default function StoriesPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Story Builder</h1>
        <p className="text-muted-foreground">Create your own magical adventures with AI!</p>
      </div>
      <StoryBuilder />
    </PageWrapper>
  )
}
