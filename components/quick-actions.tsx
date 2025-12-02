"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Compass, MessageCircle, Gamepad2, BookOpen } from "lucide-react"

const actions = [
  {
    href: "/explore",
    icon: Compass,
    title: "Explore",
    description: "Discover amazing creatures!",
    color: "bg-primary/20 text-primary",
    delay: "0s",
  },
  {
    href: "/chat",
    icon: MessageCircle,
    title: "Chat",
    description: "Talk to Professor Pine!",
    color: "bg-accent/20 text-accent-foreground",
    delay: "0.1s",
  },
  {
    href: "/games",
    icon: Gamepad2,
    title: "Play",
    description: "Fun games and quizzes!",
    color: "bg-secondary/40 text-secondary-foreground",
    delay: "0.2s",
  },
  {
    href: "/stories",
    icon: BookOpen,
    title: "Stories",
    description: "Create adventures!",
    color: "bg-chart-5/20 text-foreground",
    delay: "0.3s",
  },
]

export function QuickActions() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">What would you like to do?</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.href} href={action.href}>
              <Card
                className={`p-6 hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-primary/30 ${action.color}`}
                style={{ animationDelay: action.delay }}
              >
                <Icon className="w-10 h-10 mb-3" />
                <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                <p className="text-sm opacity-80">{action.description}</p>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
