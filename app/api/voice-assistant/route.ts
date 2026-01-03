import { getVoiceResponse } from "@/services/geminiService"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messages, videoFrame } = await req.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 })
    }

    const response = await getVoiceResponse(messages)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("[v0] Voice assistant API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
