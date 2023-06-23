"use client"

import "@/styles/globals.css"
import { ApiContext, useApi } from "@/utils/api"

import "moment-timezone"
// import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { ModalLoading } from "@/components/modal-loading"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const api = useApi({
    ignorePaths: ["/settings"],
  })
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased"
            // fontSans.variable
          )}
        >
          <ModalLoading visible={!api.isLoaded} />
          <ApiContext.Provider value={api}>
            <ThemeProvider attribute="class" defaultTheme="dark">
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
              </div>
              <TailwindIndicator />
            </ThemeProvider>
          </ApiContext.Provider>
        </body>
      </html>
    </>
  )
}
