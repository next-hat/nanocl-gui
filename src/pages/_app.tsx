import React from "react"
import type { AppProps } from "next/app"

import "@/styles/globals.css"

import { ApiContext, useApi } from "@/utils/api"

export default function App({ Component, pageProps }: AppProps) {
  const api = useApi({
    ignorePaths: ["/settings"],
  })

  return (
    <ApiContext.Provider value={api}>
      <Component {...pageProps} />
    </ApiContext.Provider>
  )
}
