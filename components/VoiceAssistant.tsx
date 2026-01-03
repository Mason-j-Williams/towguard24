"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Video, VideoOff, Send } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [videoFrame, setVideoFrame] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/voice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          videoFrame: videoEnabled ? videoFrame : null,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Voice assistant error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setVideoEnabled(true)
      }
    } catch (err) {
      console.error("[v0] Video start error:", err)
      alert("Unable to access camera. Please grant camera permissions.")
    }
  }

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setVideoEnabled(false)
    setVideoFrame(null)
  }

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const frame = canvas.toDataURL("image/jpeg", 0.8)
        setVideoFrame(frame)
      }
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (videoEnabled && isRecording) {
      interval = setInterval(captureFrame, 2000)
    }
    return () => clearInterval(interval)
  }, [videoEnabled, isRecording])

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording && videoEnabled) {
      captureFrame()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Mic className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Voice Safety Assistant</h1>
          <p className="text-sm text-muted-foreground">AI-powered roadside support with vision</p>
        </div>
      </div>

      {/* Video Preview */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-black aspect-video flex items-center justify-center">
            {videoEnabled ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="destructive" className="animate-pulse">
                    LIVE
                  </Badge>
                  <Badge variant="secondary">Cyber-Eye Active</Badge>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground p-8">
                <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Enable camera for visual roadside analysis</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <Button onClick={videoEnabled ? stopVideo : startVideo} variant={videoEnabled ? "destructive" : "default"}>
          {videoEnabled ? <VideoOff className="w-4 h-4 mr-2" /> : <Video className="w-4 h-4 mr-2" />}
          {videoEnabled ? "Stop Camera" : "Start Camera"}
        </Button>

        <Button
          onClick={toggleRecording}
          variant={isRecording ? "destructive" : "outline"}
          className={isRecording ? "animate-pulse" : ""}
        >
          {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className={message.role === "user" ? "bg-primary/5" : ""}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Badge variant={message.role === "user" ? "default" : "secondary"}>
                  {message.role === "user" ? "You" : "AI"}
                </Badge>
                <p className="text-sm flex-1 leading-relaxed">{message.content}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {isLoading && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">AI</Badge>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your roadside situation..."
          className="flex-1 px-4 py-2 rounded-lg border bg-background text-sm"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
