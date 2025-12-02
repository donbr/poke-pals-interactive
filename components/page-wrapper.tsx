import { Navigation } from "./navigation"
import { Footer } from "./footer"
import type { ReactNode } from "react"

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-20 flex flex-col">
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1">{children}</main>
      <Footer />
    </div>
  )
}
