import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"

import { ApiContext } from "@/utils/api"

import debounce from "lodash/debounce"

import PageTitle from "@/components/PageTitle"
import PageOverlay from "@/components/PageOverlay"
import Console from "@/components/Console"
import MetaHeader from "@/components/MetaHeader"

export default function Cargo() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const [data, setData] = React.useState<string>("")

  React.useEffect(() => {
    if (!api.url || !router.isReady) return

    fetch(
      `${api.url}/cargoes/${router.query.name}/logs?Namespace=${router.query.Namespace}`,
    )
      .then(async (res) => {
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
      .catch((err) => {
        console.error(err)
      })
  }, [
    api.url,
    router.isReady,
    router.query.name,
    router.query.Namespace,
    setData,
  ])

  return (
    <>
      <MetaHeader title={`Logs ${router.query.name || ""}`} />
      <PageOverlay>
        <PageTitle title={`Logs ${router.query.name || ""}`} />
        <Console id="StateLogs" data={data} enableStream />
      </PageOverlay>
    </>
  )
}
