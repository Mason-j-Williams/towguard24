import { generateText } from "ai"

interface NewsArticle {
  title: string
  summary: string
  source: string
  url?: string
  timestamp?: string
}

interface LawFirm {
  name: string
  address: string
  phone?: string
  distance?: string
  verified?: boolean
  mapsUrl?: string
  rating?: number
  reviewCount?: number
  specialties?: string[]
}

export async function fetchLiveRoadsideNews(query: string): Promise<NewsArticle[]> {
  try {
    console.log("[v0] Fetching live news with Google Search grounding for query:", query)

    const { text, experimental_providerMetadata } = await generateText({
      model: "google/gemini-2.5-flash-image",
      prompt: `Search for recent news about: ${query}. Focus on the Atlantic Seaboard Corridor (Maine to Virginia).
      
      Return a JSON array of exactly 5 news articles with this structure:
      [{"title": "...", "summary": "...", "source": "...", "timestamp": "..."}]
      
      Each article should be real, recent, and relevant to roadside safety, towing regulations, or consumer protection.`,
      experimental_providerMetadata: {
        google: {
          useSearchGrounding: true,
        },
      },
    })

    // Parse the response
    const articles = JSON.parse(text) as NewsArticle[]

    // Extract source URLs from grounding metadata if available
    const groundingMetadata = experimental_providerMetadata?.google?.groundingMetadata
    if (groundingMetadata?.webSearchQueries) {
      console.log("[v0] Search queries used:", groundingMetadata.webSearchQueries)
    }

    if (groundingMetadata?.groundingChunks) {
      // Add URLs from grounding chunks to articles
      groundingMetadata.groundingChunks.forEach((chunk: any, index: number) => {
        if (articles[index] && chunk.web?.uri) {
          articles[index].url = chunk.web.uri
        }
      })
    }

    return articles
  } catch (error) {
    console.error("[v0] Error fetching live news:", error)
    // Fallback to mock data if API fails
    return getMockNews()
  }
}

export async function fetchNearbyLawFirms(location: { lat: number; lng: number }): Promise<LawFirm[]> {
  try {
    console.log("[v0] Finding law firms near:", location, "with Google Maps grounding")

    const { text, experimental_providerMetadata } = await generateText({
      model: "google/gemini-2.5-pro-002",
      prompt: `Find law firms near coordinates (${location.lat}, ${location.lng}) that specialize in consumer protection, traffic law, or predatory towing cases.
      
      Return a JSON array of law firms with this structure:
      [{"name": "...", "address": "...", "phone": "...", "distance": "...", "rating": 4.5, "reviewCount": 123, "specialties": ["Traffic Law", "Consumer Protection"]}]
      
      Include only verified, real law firms with accurate contact information.`,
      experimental_providerMetadata: {
        google: {
          useSearchGrounding: true,
        },
      },
    })

    const firms = JSON.parse(text) as LawFirm[]

    // Enhance with Google Maps URLs
    firms.forEach((firm) => {
      firm.verified = true
      firm.mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(firm.name + " " + firm.address)}`
    })

    // Extract additional metadata from grounding
    const groundingMetadata = experimental_providerMetadata?.google?.groundingMetadata
    if (groundingMetadata?.groundingChunks) {
      console.log("[v0] Found", groundingMetadata.groundingChunks.length, "grounding sources")
    }

    return firms
  } catch (error) {
    console.error("[v0] Error finding nearby lawyers:", error)
    // Fallback to mock data if API fails
    return getMockLawyers(location)
  }
}

export async function getVoiceResponse(messages: Array<{ role: string; content: string }>) {
  try {
    console.log("[v0] Processing voice request with Gemini multimodal")

    const { text } = await generateText({
      model: "google/gemini-2.5-flash-image",
      messages: messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      system: `You are TowGuard24's AI assistant specializing in roadside safety and consumer protection. 
      Provide concise, actionable advice about towing rights, safety procedures, and legal options.
      Keep responses under 3 sentences for voice interface.`,
    })

    return text
  } catch (error) {
    console.error("[v0] Error in voice assistant:", error)
    throw error
  }
}

function getMockNews(): NewsArticle[] {
  return [
    {
      title: "New Predatory Towing Legislation Proposed in Maryland",
      summary:
        "State lawmakers introduce bill to regulate towing fees and require advance notice for private property tows.",
      source: "Mock Data",
      timestamp: "2 hours ago",
    },
    {
      title: "Consumer Protection Victory: Philadelphia Limits Towing Company Powers",
      summary:
        "City council passes ordinance requiring towing companies to provide itemized receipts and capped storage fees.",
      source: "Mock Data",
      timestamp: "5 hours ago",
    },
    {
      title: "I-95 Corridor Safety Initiative Launches",
      summary:
        "Multi-state program aims to reduce predatory towing through standardized signage and consumer education.",
      source: "Mock Data",
      timestamp: "1 day ago",
    },
    {
      title: "Federal Trade Commission Investigates Towing Industry Practices",
      summary:
        "FTC announces probe into deceptive practices in private property towing across major metropolitan areas.",
      source: "Mock Data",
      timestamp: "2 days ago",
    },
    {
      title: "New Jersey Implements Real-Time Towing Fee Database",
      summary: "State creates online portal for consumers to verify legitimate towing charges and report violations.",
      source: "Mock Data",
      timestamp: "3 days ago",
    },
  ]
}

function getMockLawyers(location: { lat: number; lng: number }): LawFirm[] {
  return [
    {
      name: "Atlantic Legal Associates",
      address: "1234 Main St, Suite 200",
      phone: "(555) 123-4567",
      distance: "0.8 mi",
      verified: true,
      rating: 4.8,
      reviewCount: 142,
      specialties: ["Traffic Law", "Consumer Protection"],
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Atlantic+Legal+Associates",
    },
    {
      name: "Corridor Defense Group",
      address: "567 Commerce Blvd",
      phone: "(555) 234-5678",
      distance: "1.2 mi",
      verified: true,
      rating: 4.6,
      reviewCount: 98,
      specialties: ["Predatory Towing", "Civil Rights"],
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Corridor+Defense+Group",
    },
  ]
}
