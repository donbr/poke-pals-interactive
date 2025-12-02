"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Theme = "candy" | "space" | "ocean"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("candy")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("pokepals-theme") as Theme
    if (saved && ["candy", "space", "ocean"].includes(saved)) {
      setTheme(saved)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    localStorage.setItem("pokepals-theme", theme)

    document.documentElement.classList.remove("theme-space", "theme-ocean")
    if (theme !== "candy") {
      document.documentElement.classList.add(`theme-${theme}`)
    }
  }, [theme, mounted])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
