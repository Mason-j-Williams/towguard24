"use client"

import type React from "react"
import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Code2, Send, Trash2 } from "lucide-react"

export default function CodeAssistant() {
  const [input, setInput] = useState("")

  const { messages, sendMessage, status, clearMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/code-assistant" }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status !== "ready") return
    sendMessage({ text: input })
    setInput("")
  }

  const isLoading = status === "streaming" || status === "submitted"

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="space-y-1 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl">AI Code Assistant</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            Powered by Gemini
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Get help with code review, debugging, and optimization</p>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[500px] p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center text-muted-foreground">
              <Code2 className="w-16 h-16 opacity-20" />
              <div>
                <h3 className="mb-2 font-semibold text-foreground">Welcome to your AI Code Assistant</h3>
                <p className="text-sm">
                  Ask me to review code, explain concepts, debug issues, or suggest improvements
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="mb-1 text-xs font-semibold opacity-70">
                      {message.role === "user" ? "You" : "Assistant"}
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {message.parts.map((part, index) => {
                        if (part.type === "text") {
                          return (
                            <div key={index} className="whitespace-pre-wrap">
                              {part.text}
                            </div>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t bg-muted/30">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your code or ask a question..."
              className="min-h-[100px] resize-none"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSubmit(e)
                }
              }}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Press {typeof navigator !== "undefined" && navigator.platform.includes("Mac") ? "⌘" : "Ctrl"} + Enter to
                send
              </span>
              <div className="flex gap-2">
                {messages.length > 0 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => clearMessages()} disabled={isLoading}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
                <Button type="submit" size="sm" disabled={!input.trim() || isLoading}>
                  {isLoading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
