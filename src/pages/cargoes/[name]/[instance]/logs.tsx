import React from "react"
import { useRouter } from "next/router"

import { ApiContext } from "@/utils/api"

import debounce from "lodash/debounce"

import PageTitle from "@/components/PageTitle"
import PageOverlay from "@/components/PageOverlay"
import Console from "@/components/Console"
import {
  LogOptions,
  LogOptionsDisplay,
  useLogOptions,
} from "@/components/LogOptions"
import MetaHeader from "@/components/MetaHeader"
import { getQs } from "@/utils/qs"

function queryParams(nsp: string, options: LogOptions): string {
  let result = `Namespace=${nsp}&Follow=${options.follow}&Timestamps=${options.timestamps}&Tail=${options.tail}`
  if (options.until) result += `&Until=${options.until}`
  if (options.since) result += `&Since=${options.since}`
  return result
}

export default function Cargo() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const [data, setData] = React.useState<string>("")
  const [controller, setController] = React.useState(
    () => new AbortController(),
  )
  const [opts] = useLogOptions()

  React.useEffect(() => {
    if (!api.url || !router.isReady) return

    controller.abort("disconnected from log stream (this is no error. ignore)")
    const fetchController = new AbortController()
    setController(fetchController)
    fetch(
      `${api.url}/cargoes/${router.query.name}/logs?${queryParams(
        router.query.Namespace as string,
        opts,
      )}`,
      { signal: fetchController.signal },
    )
      .then(async (res) => {
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
      .catch((err) => {
        console.error(err)
      })
  }, [
    api.url,
    router.isReady,
    router.query.name,
    router.query.Namespace,
    setData,
    opts,
  ])

  return (
    <>
      <MetaHeader title={`Logs ${getQs(router.query.name) || ""}`} />
      <PageOverlay>
        <PageTitle title={`Logs ${getQs(router.query.name) || ""}`} />
        <LogOptionsDisplay />
        <Console id="StateLogs" data={data} enableStream />
      </PageOverlay>
    </>
  )
}
