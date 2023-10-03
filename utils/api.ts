import React from "react"
import { usePathname, useRouter } from "next/navigation"
import axios, { type AxiosInstance } from "axios"

export const lastVersion = "v0.10"

export type UseAxiosOpts = {
  ignorePaths: string[]
}

export type Api = {
  instance: AxiosInstance
  url?: string
  isLoaded: boolean
}

export function initApi(apiUrl?: string): Api {
  return {
    instance: axios.create({
      baseURL: apiUrl ? apiUrl + `/${lastVersion}` : undefined,
      timeout: 100000,
      headers: {},
    }),
    url: apiUrl ? apiUrl + `/${lastVersion}` : undefined,
    isLoaded: false,
  }
}

export function useApi(
  options: UseAxiosOpts = {
    ignorePaths: [],
  }
): Api {
  const router = useRouter()
  const pathname = usePathname()
  const [api, setApi] = React.useState<Api>(initApi())
  React.useEffect(() => {
    const API_URL = window.localStorage.getItem("API_URL")
    const newApi = initApi(API_URL || undefined)
    if (options.ignorePaths.includes(pathname)) {
      setTimeout(() => {
        newApi.isLoaded = true
        setApi(newApi)
      }, 500)
      return
    }
    if (!newApi.url && !api.isLoaded) {
      router.push("/settings")
      return
    }
    if (api.url === newApi.url && api.isLoaded) return
    newApi.isLoaded = false
    newApi.instance
      .head("/_ping")
      .then((res) => {
        if (res.status !== 202) {
          throw instanceError(res)
        }
        setTimeout(() => {
          newApi.isLoaded = true
          setApi(newApi)
        }, 500)
      })
      .catch((err) => {
        const e = instanceError(err)
        const newApi = initApi()
        setTimeout(() => {
          newApi.isLoaded = true
          setApi(newApi)
          router.push(`/settings?Error=${e.message}`)
        }, 500)
      })
  }, [pathname, api.isLoaded, api.url, options.ignorePaths, router, setApi])

  return api as Api
}

export const ApiContext = React.createContext<Api>(initApi())

export type NanoclDecoder = {
  bytes: string
  decoder: TextDecoder
  decode: (chunk?: any, options?: any) => { bytes: string; isDone: boolean }
  parse: () => string
}

export const createNanoclDecoder = (
  transformer: (obj: any) => string
): NanoclDecoder => {
  let bytes = ""
  let decoder = new TextDecoder("utf-8")

  return {
    bytes,
    decoder,
    decode: function (chunk, options) {
      this.bytes += this.decoder.decode(chunk, options)
      return {
        bytes: this.bytes,
        isDone:
          this.bytes.charAt(this.bytes.length - 2) === "\r" &&
          this.bytes.charAt(this.bytes.length - 1) === "\n",
      }
    },
    parse: function () {
      let s = this.bytes
        .split("\r\n")
        .reduce((acc: string, line: string | null) => {
          if (line === "") return acc
          if (!line) return acc
          const data = JSON.parse(line)
          acc += transformer(data)
          return acc
        }, "")
      this.bytes = ""
      this.decoder = new TextDecoder("utf-8")
      return s
    },
  }
}

export function instanceError(err: any): Error {
  console.log(err)
  const res = err.response
  return new Error(
    res?.data?.msg || res?.data || err.message || "An unknown error occurred."
  )
}
