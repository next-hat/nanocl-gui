"use client"

import * as React from "react"
import { Button } from "nanocl-gui-toolkit/components/ui/button"
import { useTheme } from "next-themes"

import { Icons } from "@/components/icons"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      className="outline-none"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Icons.sun
        fill="orange"
        color="orange"
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Icons.moon
        fill="white"
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
