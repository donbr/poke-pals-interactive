"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Compass, MessageCircle, Gamepad2, BookOpen, Palette } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/chat", label: "Prof. Pine", icon: MessageCircle },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/stories", label: "Stories", icon: BookOpen },
  { href: "/themes", label: "Themes", icon: Palette },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t-2 border-primary/20 md:top-0 md:bottom-auto md:border-t-0 md:border-b-2">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between md:justify-start md:gap-2">
          {/* Logo - hidden on mobile */}
          <Link href="/" className="hidden md:flex items-center gap-2 py-4 pr-6 mr-4 border-r border-border">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-bounce-gentle">
              <span className="text-primary-foreground text-xl font-bold">P</span>
            </div>
            <span className="text-xl font-bold text-foreground">PokéPals</span>
          </Link>

          {/* Nav items */}
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1 md:gap-2 py-3 px-2 md:px-4 md:py-4 rounded-xl transition-all",
                  "hover:bg-primary/10 active:scale-95",
                  isActive && "bg-primary/15 text-primary",
                )}
              >
                <Icon className={cn("w-5 h-5 md:w-5 md:h-5", isActive && "animate-wiggle")} />
                <span
                  className={cn(
                    "text-xs md:text-sm font-semibold",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
