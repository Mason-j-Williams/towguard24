import { fetchNearbyLawFirms } from "@/services/geminiService"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { location } = await req.json()

    if (!location || !location.lat || !location.lng) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 })
    }

    const firms = await fetchNearbyLawFirms(location)

    return NextResponse.json({ firms })
  } catch (error) {
    console.error("[v0] Lawyers API error:", error)
    return NextResponse.json({ error: "Failed to find lawyers" }, { status: 500 })
  }
}
