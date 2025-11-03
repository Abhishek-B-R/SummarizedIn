"use client"

import { Copy, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface SummaryResultProps {
  summary: string
}

export default function SummaryResult({ summary }: SummaryResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-2xl p-8 border border-border bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Summary</h2>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 hover:bg-background transition-all duration-300 border border-border text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{summary}</p>
        </div>
      </div>
    </div>
  )
}
