"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Scale, MapPin, Phone, Navigation, ExternalLink, Star, Wifi } from "lucide-react"

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

export default function LawDirectoryView() {
  const [firms, setFirms] = useState<LawFirm[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLiveMode, setIsLiveMode] = useState(false)

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (err) => {
          console.error("[v0] Geolocation error:", err)
          setError("Unable to get your location. Please enable location services.")
        },
      )
    } else {
      setError("Geolocation is not supported by your browser.")
    }
  }

  const findLawyers = async () => {
    if (!userLocation) {
      getUserLocation()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/lawyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: userLocation }),
      })

      if (!response.ok) throw new Error("Failed to find lawyers")

      const data = await response.json()
      setFirms(data.firms || [])
      setIsLiveMode(data.firms?.some((f: LawFirm) => f.rating && f.reviewCount))
    } catch (err) {
      setError("Unable to find nearby lawyers. Please try again.")
      console.error("[v0] Lawyer search error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserLocation()
  }, [])

  useEffect(() => {
    if (userLocation) {
      findLawyers()
    }
  }, [userLocation])

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Scale className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Legal Directory</h1>
              {isLiveMode && (
                <Badge variant="default" className="bg-green-500 animate-pulse">
                  <Wifi className="w-3 h-3 mr-1" />
                  LIVE UPLINK
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {isLiveMode ? "Real law firms via Google Maps grounding" : "Cached directory results"}
            </p>
          </div>
        </div>
        <Button onClick={findLawyers} disabled={loading || !userLocation} variant="outline" size="sm">
          <Navigation className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Find Nearby
        </Button>
      </div>

      {!userLocation && !error && (
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="pt-6">
            <p className="text-sm">Requesting your location to find nearby law firms...</p>
          </CardContent>
        </Card>
      )}

      {loading && firms.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="w-8 h-8" />
            <p className="text-sm text-muted-foreground">Searching Google Maps for verified law firms...</p>
            <p className="text-xs text-muted-foreground">Using Gemini 2.5 Pro with Maps grounding...</p>
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

      <div className="grid gap-4 md:grid-cols-2">
        {firms.map((firm, index) => (
          <Card key={index} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {firm.verified && (
                      <Badge variant="default" className="bg-green-500">
                        Verified
                      </Badge>
                    )}
                    {firm.distance && <Badge variant="outline">{firm.distance}</Badge>}
                    {firm.rating && (
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{firm.rating}</span>
                        {firm.reviewCount && <span className="text-muted-foreground">({firm.reviewCount})</span>}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">{firm.name}</CardTitle>
                </div>
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{firm.address}</p>
              </div>

              {firm.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${firm.phone}`} className="text-primary hover:underline">
                    {firm.phone}
                  </a>
                </div>
              )}

              {firm.specialties && firm.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {firm.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {firm.mapsUrl && (
                  <Button size="sm" variant="default" asChild className="flex-1">
                    <a href={firm.mapsUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View on Maps
                    </a>
                  </Button>
                )}
                {firm.phone && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`tel:${firm.phone}`}>
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
