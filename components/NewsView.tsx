"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Newspaper, ExternalLink, RefreshCw, Wifi } from "lucide-react"

interface NewsArticle {
  title: string
  summary: string
  source: string
  url?: string
  timestamp?: string
}

export default function NewsView() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLiveMode, setIsLiveMode] = useState(false)

  const fetchNews = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "predatory towing Atlantic Corridor traffic legislation consumer protection",
        }),
      })

      if (!response.ok) throw new Error("Failed to fetch news")

      const data = await response.json()
      setArticles(data.articles || [])
      setIsLiveMode(data.articles?.some((a: NewsArticle) => a.url && !a.url.includes("mock")))
    } catch (err) {
      setError("Unable to load live news. Please try again.")
      console.error("[v0] News fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <Newspaper className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Live Global Feed</h1>
              {isLiveMode && (
                <Badge variant="default" className="bg-green-500 animate-pulse">
                  <Wifi className="w-3 h-3 mr-1" />
                  LIVE UPLINK
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {isLiveMode ? "Real-time intelligence via Google Search grounding" : "Heritage archive mode"}
            </p>
          </div>
        </div>
        <Button onClick={fetchNews} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading && articles.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="w-8 h-8" />
            <p className="text-sm text-muted-foreground">Searching global news sources with Gemini neural network...</p>
            <p className="text-xs text-muted-foreground">Querying Google Search grounding...</p>
          </div>
        </div>
      )}

      {error && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="pt-6">
            <p className="text-sm text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {articles.map((article, index) => (
          <Card key={index} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {index === 0 && isLiveMode && (
                      <Badge variant="destructive" className="animate-pulse">
                        LIVE INTEL
                      </Badge>
                    )}
                    <Badge variant="outline">{article.source}</Badge>
                    {article.timestamp && <span className="text-xs text-muted-foreground">{article.timestamp}</span>}
                    {article.url && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                        Verified Source
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                </div>
                {article.url && (
                  <Button size="sm" variant="ghost" asChild>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" title="View original source">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
              <CardDescription className="text-sm leading-relaxed pt-2">{article.summary}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
