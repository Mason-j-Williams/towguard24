"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewsView from "@/components/NewsView"
import LawDirectoryView from "@/components/LawDirectoryView"
import VoiceAssistant from "@/components/VoiceAssistant"
import { Shield, Newspaper, Scale, Mic } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("news")

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">TowGuard24</h1>
                <p className="text-xs text-muted-foreground">Guardian Plus • Phase 2</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <span className="text-xs font-medium text-green-500">Live Intelligence Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              <span className="hidden sm:inline">News Feed</span>
            </TabsTrigger>
            <TabsTrigger value="lawyers" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">Legal Directory</span>
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">Voice Assistant</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="mt-0">
            <NewsView />
          </TabsContent>

          <TabsContent value="lawyers" className="mt-0">
            <LawDirectoryView />
          </TabsContent>

          <TabsContent value="assistant" className="mt-0">
            <VoiceAssistant />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>Powered by Google Gemini AI • Real-time intelligence grounding</p>
            <p className="text-xs">© 2025 TowGuard24. Protecting drivers in the Atlantic Corridor.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
