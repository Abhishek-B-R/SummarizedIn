"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2, Zap } from "lucide-react"

interface LinkedInSummarizerFormProps {
  onSummarize: (url: string) => void
  isLoading: boolean
}

export default function LinkedInSummarizerForm({ onSummarize, isLoading }: LinkedInSummarizerFormProps) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  const isValidLinkedInUrl = (urlString: string): boolean => {
    try {
      const parsedUrl = new URL(urlString)
      return (
        (parsedUrl.hostname.includes("linkedin.com") || parsedUrl.hostname.includes("linkedin.in")) &&
        parsedUrl.pathname.includes("/posts/")
      )
    } catch {
      return false
    }
  }

  useEffect(() => {
    if (url && !isValidLinkedInUrl(url)) {
      setError("Please enter a valid LinkedIn post URL")
    } else {
      setError("")
    }
  }, [url])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a LinkedIn post URL")
      return
    }

    if (!isValidLinkedInUrl(url)) {
      setError("Please enter a valid LinkedIn post URL")
      return
    }

    onSummarize(url)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-2xl p-8 border border-border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="mb-7">
          <label className="block text-sm font-semibold text-foreground mb-3">LinkedIn Post URL</label>
          <input
            type="url"
            placeholder="https://www.linkedin.com/posts/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 bg-background/50 placeholder-muted-foreground text-foreground disabled:opacity-50 disabled:cursor-not-allowed ${
              error && url
                ? "border-destructive/50 focus:ring-destructive/30"
                : "border-border hover:border-border/80 focus:ring-accent/30"
            }`}
          />
        </div>

        {error && url && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <div className="w-1.5 h-1.5 rounded-full bg-destructive/70"></div>
            <span className="text-sm text-destructive/80">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !!error || !url}
          className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-accent hover:bg-accent/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Summarizing…</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Summarize</span>
            </>
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Paste any LinkedIn post URL to generate a summary
        </p>
      </div>
    </form>
  )
}
