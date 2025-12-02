"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Check, Candy, Rocket, Waves, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const themes = [
  {
    id: "candy" as const,
    name: "Candy",
    description: "Sweet and colorful!",
    icon: Candy,
    preview: {
      bg: "bg-pink-50",
      primary: "bg-pink-400",
      secondary: "bg-yellow-300",
      accent: "bg-cyan-400",
    },
  },
  {
    id: "space" as const,
    name: "Space",
    description: "Cosmic and mysterious!",
    icon: Rocket,
    preview: {
      bg: "bg-slate-900",
      primary: "bg-purple-500",
      secondary: "bg-blue-500",
      accent: "bg-yellow-400",
    },
  },
  {
    id: "ocean" as const,
    name: "Ocean",
    description: "Cool and refreshing!",
    icon: Waves,
    preview: {
      bg: "bg-cyan-50",
      primary: "bg-cyan-500",
      secondary: "bg-yellow-400",
      accent: "bg-teal-400",
    },
  },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {themes.map((t) => {
          const Icon = t.icon
          const isActive = theme === t.id

          return (
            <Card
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "p-6 cursor-pointer transition-all border-2",
                isActive
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-transparent hover:border-primary/30",
              )}
            >
              {/* Theme preview */}
              <div className={cn("rounded-xl p-4 mb-4", t.preview.bg)}>
                <div className="flex gap-2 mb-2">
                  <div className={cn("w-8 h-8 rounded-full", t.preview.primary)} />
                  <div className={cn("w-8 h-8 rounded-full", t.preview.secondary)} />
                  <div className={cn("w-8 h-8 rounded-full", t.preview.accent)} />
                </div>
                <div className={cn("h-3 rounded-full w-3/4", t.preview.primary, "opacity-60")} />
                <div className={cn("h-3 rounded-full w-1/2 mt-2", t.preview.secondary, "opacity-60")} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    <p className="text-sm text-muted-foreground">{t.description}</p>
                  </div>
                </div>
                {isActive && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Theme Magic</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your chosen theme changes the colors throughout the entire app! Try switching between themes to find your
              favorite. The Candy theme is sweet and pink, Space is dark and cosmic, and Ocean is cool and refreshing.
              Your choice will be saved so it&apos;s always ready when you come back!
            </p>
          </div>
        </div>
      </Card>

      {/* Preview of current theme */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Current Theme Preview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-16 rounded-xl bg-primary" />
            <p className="text-xs text-center text-muted-foreground">Primary</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 rounded-xl bg-secondary" />
            <p className="text-xs text-center text-muted-foreground">Secondary</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 rounded-xl bg-accent" />
            <p className="text-xs text-center text-muted-foreground">Accent</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 rounded-xl bg-muted" />
            <p className="text-xs text-center text-muted-foreground">Muted</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </Card>
    </div>
  )
}
