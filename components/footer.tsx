import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card/50 border-t border-primary/10 py-6 mt-8 mb-20 md:mb-0">
      <div className="max-w-5xl mx-auto px-4 text-center space-y-2">
        <p className="text-sm text-foreground/70">
          Made with <span className="text-pink-500">💜</span> by fans • Pokémon trademarks © their owners • Data from{" "}
          <Link
            href="https://pokeapi.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            PokeAPI
          </Link>
        </p>
        <p className="text-xs text-foreground/50">
          PokéPals is not affiliated with Nintendo, Game Freak, or The Pokémon Company.
        </p>
      </div>
    </footer>
  )
}
