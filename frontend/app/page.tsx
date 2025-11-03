"use client"

import { useState } from "react"
import LinkedInSummarizerForm from "@/components/linkedin-summarizer-form"
import SummaryResult from "@/components/summary-result"
import ThemeToggle from "@/components/theme-toggle"

export default function Home() {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSummarize = async (url: string) => {
    setIsLoading(true)
    setSummary(null)

    try {
      const response = await fetch("http://localhost:8085/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (response.ok) {
        const data = await response.json()
        setSummary(data.summary)
      } else {
        setSummary("Error: Failed to generate summary. Please try again.")
      }
    } catch (error) {
      setSummary("Error: Unable to connect to the server.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4">
      <ThemeToggle />
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>

      <div className="w-full max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground tracking-tight mb-3">Summarized In</h1>
          <p className="text-base text-muted-foreground">Transform linkedIn posts into concise insights instantly</p>
        </div>

        <LinkedInSummarizerForm onSummarize={handleSummarize} isLoading={isLoading} />

        {summary && <SummaryResult summary={summary} />}
      </div>
    </main>
  )
}
