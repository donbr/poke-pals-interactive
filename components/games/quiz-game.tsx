"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizGameProps {
  onBack: () => void
}

interface Question {
  question: string
  options: string[]
  correctIndex: number
}

export function QuizGame({ onBack }: QuizGameProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchQuestions = async () => {
    setLoading(true)
    setCurrentQ(0)
    setScore(0)
    setGameOver(false)
    setSelectedAnswer(null)
    setShowResult(false)

    try {
      const res = await fetch("/api/llm/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 5 }),
      })
      const data = await res.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error("Failed to fetch questions:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const handleAnswer = (index: number) => {
    if (showResult) return

    setSelectedAnswer(index)
    setShowResult(true)

    if (index === questions[currentQ].correctIndex) {
      setScore((s) => s + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQ >= questions.length - 1) {
      setGameOver(true)
    } else {
      setCurrentQ((q) => q + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const question = questions[currentQ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Question {currentQ + 1}/{questions.length}
          </span>
          <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="font-bold">{score}</span>
          </div>
        </div>
      </div>

      <Card className="p-8">
        {loading ? (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Generating fun questions...</p>
          </div>
        ) : gameOver ? (
          <div className="text-center py-8">
            <Trophy className="w-20 h-20 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-xl text-muted-foreground mb-6">
              You scored {score} out of {questions.length}!
            </p>
            <p className="text-lg mb-8">
              {score === questions.length && "Perfect score! You're a creature expert!"}
              {score >= questions.length * 0.6 && score < questions.length && "Great job! You know your stuff!"}
              {score < questions.length * 0.6 && "Keep learning! You'll do better next time!"}
            </p>
            <Button onClick={fetchQuestions} size="lg" className="rounded-full px-8">
              Play Again
            </Button>
          </div>
        ) : question ? (
          <>
            <h2 className="text-xl md:text-2xl font-bold text-center mb-8">{question.question}</h2>

            <div className="grid gap-3 max-w-xl mx-auto">
              {question.options.map((option, i) => {
                const isCorrect = i === question.correctIndex
                const isSelected = i === selectedAnswer

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={showResult}
                    className={cn(
                      "p-4 rounded-xl text-left font-medium transition-all border-2",
                      !showResult && "hover:border-primary hover:bg-primary/5",
                      showResult && isCorrect && "border-green-500 bg-green-100 text-green-700",
                      showResult && isSelected && !isCorrect && "border-red-500 bg-red-100 text-red-700",
                      !showResult && "border-border",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {showResult && (
              <div className="text-center mt-8">
                <Button onClick={nextQuestion} size="lg" className="rounded-full px-8">
                  {currentQ >= questions.length - 1 ? "See Results" : "Next Question"}
                </Button>
              </div>
            )}
          </>
        ) : null}
      </Card>
    </div>
  )
}
