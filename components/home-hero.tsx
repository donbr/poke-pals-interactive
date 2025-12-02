"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-8 md:p-12 mb-8">
      {/* Floating decorations */}
      <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-primary/30 animate-float" />
      <div
        className="absolute bottom-8 left-8 w-10 h-10 rounded-full bg-secondary/40 animate-bounce-gentle"
        style={{ animationDelay: "0.5s" }}
      />
      <div className="absolute top-1/2 right-1/4 w-8 h-8 rounded-full bg-accent/30 animate-sparkle" />

      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Sparkles className="w-4 h-4" />
          Welcome, Explorer!
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight text-balance">
          Your Magical Pocket Monster Adventure Starts Here!
        </h1>

        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          Meet Professor Pine, explore amazing creatures, play fun games, and create your own stories! Everything is
          designed just for curious kids like you.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg" className="rounded-full text-lg px-8 gap-2">
            <Link href="/explore">
              Start Exploring
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full text-lg px-8 bg-transparent">
            <Link href="/chat">Meet Professor Pine</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
