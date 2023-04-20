import React from "react"
import { useRouter } from "next/router"
import type { AppProps } from "next/app"

import "@/styles/globals.css"

import { ApiContext, useApi } from "@/utils/api"
import ModalLoading from "@/components/ModalLoading"

export default function App({ Component, pageProps }: AppProps) {
  const api = useApi({
    ignorePaths: ["/settings"],
  })

  return (
    <>
      <ModalLoading visible={!api.isLoaded} />
      <ApiContext.Provider value={api}>
        <Component {...pageProps} />
      </ApiContext.Provider>
    </>
  )
}
