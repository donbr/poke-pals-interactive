"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Loader2, RefreshCw, Palette } from "lucide-react"

interface ColorPlaygroundProps {
  onBack: () => void
}

export function ColorPlayground({ onBack }: ColorPlaygroundProps) {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [colors, setColors] = useState<string[]>([])

  const generatePrompt = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/llm/color-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await res.json()
      setPrompt(data.prompt)
      setColors(data.colors || [])
    } catch (error) {
      setPrompt("Draw a friendly fire creature playing in a meadow!")
      setColors(["#FF6B35", "#FFE66D", "#4ECDC4", "#95E1D3"])
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Button>
      </div>

      <Card className="p-8">
        <div className="text-center mb-8">
          <Palette className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Color Playground</h2>
          <p className="text-muted-foreground">Get creative drawing prompts and color suggestions from AI!</p>
        </div>

        {prompt ? (
          <div className="space-y-6">
            <div className="bg-muted rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Your Drawing Prompt</span>
              </div>
              <p className="text-xl font-bold leading-relaxed">{prompt}</p>
            </div>

            {colors.length > 0 && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">Suggested colors:</p>
                <div className="flex justify-center gap-3">
                  {colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-2 border-border shadow-md"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={generatePrompt}
                variant="outline"
                className="rounded-full gap-2 bg-transparent"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                New Prompt
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Button onClick={generatePrompt} size="lg" className="rounded-full px-8 gap-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Get a Drawing Idea!
                </>
              )}
            </Button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t">
          <h3 className="font-semibold mb-3">Tips for your drawing:</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Start with big shapes, then add details!</li>
            <li>• Mix the suggested colors to make new ones!</li>
            <li>• There&apos;s no wrong way to be creative!</li>
            <li>• Add your own ideas to make it unique!</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
