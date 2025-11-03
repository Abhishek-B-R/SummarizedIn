"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for saved theme preference or default to dark
    const isDark = localStorage.getItem("theme") === "light" ? false : true
    document.documentElement.classList.toggle("dark", isDark)
  }, [])

  if (!mounted) return null

  return <>{children}</>
}
