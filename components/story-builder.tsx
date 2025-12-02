"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Sparkles, Loader2, RefreshCw, ChevronRight } from "lucide-react"

interface StoryPart {
  text: string
  choices?: string[]
}

export function StoryBuilder() {
  const [heroName, setHeroName] = useState("")
  const [creatureType, setCreatureType] = useState("")
  const [setting, setSetting] = useState("")
  const [story, setStory] = useState<StoryPart[]>([])
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)

  const startStory = async () => {
    if (!heroName.trim()) return

    setLoading(true)
    setStarted(true)

    try {
      const res = await fetch("/api/llm/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          heroName,
          creatureType: creatureType || "friendly",
          setting: setting || "magical forest",
        }),
      })
      const data = await res.json()
      setStory([{ text: data.text, choices: data.choices }])
    } catch (error) {
      console.error("Story start error:", error)
      setStory([
        {
          text: `Once upon a time, ${heroName} met a ${creatureType || "friendly"} creature in a ${setting || "magical forest"}! The adventure was about to begin...`,
          choices: ["Explore deeper", "Make a new friend", "Look for treasure"],
        },
      ])
    }
    setLoading(false)
  }

  const continueStory = async (choice: string) => {
    setLoading(true)

    try {
      const res = await fetch("/api/llm/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "continue",
          heroName,
          previousStory: story.map((s) => s.text).join("\n"),
          choice,
        }),
      })
      const data = await res.json()
      setStory([...story, { text: data.text, choices: data.choices }])
    } catch (error) {
      console.error("Story continue error:", error)
    }
    setLoading(false)
  }

  const resetStory = () => {
    setStory([])
    setStarted(false)
    setHeroName("")
    setCreatureType("")
    setSetting("")
  }

  return (
    <div className="space-y-6">
      {!started ? (
        <Card className="p-8">
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Create Your Adventure!</h2>
            <p className="text-muted-foreground">Fill in the details and AI will write your story!</p>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Your Hero&apos;s Name *</label>
              <Input
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                placeholder="Enter your hero's name..."
                className="h-12 rounded-full text-center"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Creature Type (optional)</label>
              <div className="flex flex-wrap gap-2">
                {["fire", "water", "grass", "electric", "fairy"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setCreatureType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      creatureType === type ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Setting (optional)</label>
              <div className="flex flex-wrap gap-2">
                {["magical forest", "underwater kingdom", "snowy mountain", "sunny beach", "starry space"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSetting(s)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      setting === s ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={startStory}
              disabled={!heroName.trim() || loading}
              size="lg"
              className="w-full rounded-full mt-6 gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating your story...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Start My Adventure!
                </>
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              {heroName}&apos;s Adventure
            </h2>
            <Button variant="ghost" onClick={resetStory} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              New Story
            </Button>
          </div>

          {story.map((part, i) => (
            <Card key={i} className="p-6">
              <p className="text-lg leading-relaxed whitespace-pre-wrap mb-4">{part.text}</p>

              {part.choices && i === story.length - 1 && !loading && (
                <div className="space-y-2 mt-6 pt-4 border-t">
                  <p className="text-sm font-semibold text-muted-foreground mb-3">What happens next?</p>
                  {part.choices.map((choice, j) => (
                    <button
                      key={j}
                      onClick={() => continueStory(choice)}
                      className="w-full text-left p-4 rounded-xl bg-muted hover:bg-primary/10 transition-all flex items-center justify-between group"
                    >
                      <span className="font-medium">{choice}</span>
                      <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </Card>
          ))}

          {loading && (
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-muted-foreground">Writing the next chapter...</span>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
