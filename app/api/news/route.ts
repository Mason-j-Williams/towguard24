import { fetchLiveRoadsideNews } from "@/services/geminiService"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const articles = await fetchLiveRoadsideNews(query)

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("[v0] News API error:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
