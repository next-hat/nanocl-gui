"use client"

import React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ApiContext } from "@/utils/api"
import debounce from "lodash/debounce"
import moment from "moment"
import { Input } from "@/components/ui/input"

import Console from "@/components/console"

export default function CargoLogs() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = React.useState<string>("")
  const api = React.useContext(ApiContext)
  const [tail, setTail] = React.useState<string>(
    searchParams.get("tail") || "100"
  )
  React.useEffect(() => {
    if (!api.url) return
    fetch(
      `${api.url}/cargoes/${params.name}/logs?Namespace=${
        searchParams.get("namespace") || "global"
      }&Follow=true&Stdout=true&Stderr=true&&Tail=100&Since=${moment()
        .subtract(1, "days")
        .unix()} `
    ).then(async (res) => {
      setData("")
      if (res.status !== 200) return
      let b = ""
      let decoder = new TextDecoder("utf-8")
      const fn = () => {
        let d = b.split("\r\n").reduce((acc: string, line: string | null) => {
          if (line === "") return acc
          if (!line) return acc
          acc += JSON.parse(line).Data as string
          return acc
        }, "")
        b = ""
        decoder = new TextDecoder("utf-8")
        if (d === "") return
        setData((prev) => prev + d)
      }
      const debounced = debounce(fn, 1000, {
        leading: false,
        trailing: true,
        maxWait: 5000,
      })
      for await (const chunk of res.body as any) {
        b += decoder.decode(chunk, { stream: true })
        if (
          b.charAt(b.length - 2) === "\r" &&
          b.charAt(b.length - 1) === "\n"
        ) {
          debounced()
        }
      }
    })
  }, [api.isLoaded, api.instance, params.name, api.url, setData, searchParams])
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1 className="text-2xl font-extrabold leading-tight tracking-tighter">
        Cargo Logs
      </h1>
      <Input
        type="text"
        value={tail}
        placeholder="tail"
        title="Tail"
        className="w-[150px] lg:w-[250px]"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            router.push(`/cargoes/${params.name}/logs?tail=${tail}`)
          }
        }}
        onChange={(e) => {
          setTail(e.target.value)
        }}
      />
      <Console id="StateLogs" data={data} enableStream />
    </section>
  )
}
