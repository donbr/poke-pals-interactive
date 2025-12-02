"use client"

import { cn } from "@/lib/utils"

const types = [
  { name: "fire", color: "bg-orange-400 hover:bg-orange-500" },
  { name: "water", color: "bg-blue-400 hover:bg-blue-500" },
  { name: "grass", color: "bg-green-400 hover:bg-green-500" },
  { name: "electric", color: "bg-yellow-400 hover:bg-yellow-500" },
  { name: "psychic", color: "bg-pink-400 hover:bg-pink-500" },
  { name: "ice", color: "bg-cyan-300 hover:bg-cyan-400" },
  { name: "dragon", color: "bg-indigo-500 hover:bg-indigo-600" },
  { name: "fairy", color: "bg-pink-300 hover:bg-pink-400" },
  { name: "normal", color: "bg-gray-400 hover:bg-gray-500" },
  { name: "fighting", color: "bg-red-500 hover:bg-red-600" },
  { name: "flying", color: "bg-sky-300 hover:bg-sky-400" },
  { name: "poison", color: "bg-purple-400 hover:bg-purple-500" },
]

interface TypeFilterProps {
  selectedType: string | null
  onSelectType: (type: string | null) => void
}

export function TypeFilter({ selectedType, onSelectType }: TypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectType(null)}
        className={cn(
          "px-4 py-2 rounded-full font-semibold text-sm transition-all",
          !selectedType
            ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
            : "bg-muted text-muted-foreground hover:bg-muted/80",
        )}
      >
        All Types
      </button>
      {types.map((type) => (
        <button
          key={type.name}
          onClick={() => onSelectType(type.name === selectedType ? null : type.name)}
          className={cn(
            "px-4 py-2 rounded-full font-semibold text-sm text-white transition-all capitalize",
            type.color,
            selectedType === type.name && "ring-2 ring-offset-2 ring-foreground",
          )}
        >
          {type.name}
        </button>
      ))}
    </div>
  )
}
