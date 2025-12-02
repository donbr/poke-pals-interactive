"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Sparkles, TreePine, Loader2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

const suggestedQuestions = [
  "What's the coolest water creature?",
  "Tell me about fire types!",
  "Which creature is the fastest?",
  "What creature would make a good friend?",
  "Tell me a fun story!",
]

export function ProfessorPineChat() {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/llm/chat" }),
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello there, young explorer! 🌟 I'm Professor Pine, your friendly guide to the wonderful world of pocket creatures! Ask me anything about these amazing friends - I love helping curious minds like yours discover new things! What would you like to know today?",
        parts: [
          {
            type: "text",
            text: "Hello there, young explorer! 🌟 I'm Professor Pine, your friendly guide to the wonderful world of pocket creatures! Ask me anything about these amazing friends - I love helping curious minds like yours discover new things! What would you like to know today?",
          },
        ],
      },
    ],
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || status === "in_progress") return

    sendMessage({ text: inputValue })
    setInputValue("")
  }

  const handleSuggestion = (question: string) => {
    sendMessage({ text: question })
  }

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello there, young explorer! 🌟 I'm Professor Pine, your friendly guide to the wonderful world of pocket creatures! Ask me anything about these amazing friends - I love helping curious minds like yours discover new things! What would you like to know today?",
        parts: [
          {
            type: "text",
            text: "Hello there, young explorer! 🌟 I'm Professor Pine, your friendly guide to the wonderful world of pocket creatures! Ask me anything about these amazing friends - I love helping curious minds like yours discover new things! What would you like to know today?",
          },
        ],
      },
    ])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
            <TreePine className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Professor Pine</h1>
            <p className="text-sm text-muted-foreground">Your friendly creature guide</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleReset}>
          <RefreshCw className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <Card className="flex-1 overflow-y-auto p-4 mb-4 border-2">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <TreePine className="w-5 h-5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted rounded-tl-sm",
                )}
              >
                {message.parts?.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <p key={i} className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {part.text}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
              {message.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <span className="text-lg">👤</span>
                </div>
              )}
            </div>
          ))}

          {status === "in_progress" && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <TreePine className="w-5 h-5 text-primary animate-wiggle" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            Try asking:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question) => (
              <button
                key={question}
                onClick={() => handleSuggestion(question)}
                className="bg-muted hover:bg-primary/10 px-3 py-2 rounded-full text-sm transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask Professor Pine anything..."
          disabled={status === "in_progress"}
          className="h-14 text-base rounded-full border-2 px-6"
        />
        <Button
          type="submit"
          size="lg"
          disabled={status === "in_progress" || !inputValue.trim()}
          className="rounded-full px-6 h-14"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  )
}
