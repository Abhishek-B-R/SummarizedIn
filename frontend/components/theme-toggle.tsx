"use client"

import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const dark = document.documentElement.classList.contains("dark")
    setIsDark(dark)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle("dark", newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 p-3 rounded-full border border-border bg-card/60 hover:bg-card/80 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md text-foreground"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
