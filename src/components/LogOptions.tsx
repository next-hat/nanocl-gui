import React from "react"
import { NextRouter, useRouter } from "next/router"

export type LogOptions = {
  since: number | undefined
  until: number | undefined
  timestamps: boolean
  follow: boolean
  tail: string
}

export function useLogOptions(): [LogOptions, (opt: LogOptions) => void] {
  const router = useRouter()
  const queryTail = (router.query.Tail as string) || ""
  const queryFollow = router.query.Follow == "true"
  const queryTimestamps = router.query.Timestamps == "true"
  const querySince = Number.parseInt(router.query.Since as string) || undefined
  const queryUntil = Number.parseInt(router.query.Until as string) || undefined

  const [tmpOptions, setOptions] = React.useState<LogOptions>({
    tail: queryTail,
    follow: queryFollow,
    timestamps: queryTimestamps,
    since: querySince,
    until: queryUntil,
  })
  React.useEffect(() => {
    setOptions({
      tail: queryTail,
      follow: queryFollow,
      timestamps: queryTimestamps,
      since: querySince,
      until: queryUntil,
    })
  }, [
    queryTail,
    queryFollow,
    queryTimestamps,
    querySince,
    queryUntil,
    setOptions,
  ])

  return [tmpOptions, setOptions]
}

function apply(opts: LogOptions, baseUrl: string, router: NextRouter) {
  const query: any = {
    name: router.query.name,
    instance: router.query.instance,
    Namespace: router.query.Namespace,
    Tail: opts.tail,
  }

  if (opts.follow) query.Follow = true
  if (opts.timestamps) query.Timestamps = true
  if (opts.since) query.Since = opts.since
  if (opts.until) query.Until = opts.until

  router.replace({
    pathname: baseUrl,
    query,
  })
}

export function LogOptionsDisplay() {
  const router = useRouter()
  const [opt, setOpt] = useLogOptions()

  const baseUrl = "/cargoes/[name]/[instance]/logs"
  return (
    <div className="mt-4 flex flex-row justify-evenly">
      <div className="mt-4 flex flex-col">
        <label className="text-[var(--ifm-color-emphasis-500)]]">Tail</label>
        <input
          className="mb-4 mt-2 rounded border border-white bg-transparent p-2 focus:border-[var(--ifm-color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ifm-color-primary)]"
          placeholder="all"
          type="text"
          value={opt.tail}
          onBlur={() => apply(opt, baseUrl, router)}
          onChange={(e) =>
            setOpt(Object.assign({}, opt, { tail: e.target.value }))
          }
        />
      </div>
      <div className="mt-4 flex flex-col">
        <label className="text-[var(--ifm-color-emphasis-500)]]">Follow:</label>
        <input
          className="mb-4 mt-2 rounded border border-white bg-transparent p-2 focus:border-[var(--ifm-color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ifm-color-primary)]"
          type="checkbox"
          checked={opt.follow}
          onChange={(e) =>
            apply(
              Object.assign({}, opt, { follow: e.target.checked }),
              baseUrl,
              router,
            )
          }
        />
      </div>
      <div className="mt-4 flex flex-col">
        <label>Timestamps</label>
        <input
          className="mb-4 mt-2 rounded border border-white bg-transparent p-2 focus:border-[var(--ifm-color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ifm-color-primary)]"
          type="checkbox"
          checked={opt.timestamps}
          onChange={(e) =>
            apply(
              Object.assign({}, opt, { timestamps: e.target.checked }),
              baseUrl,
              router,
            )
          }
        />
      </div>
      <div className="mt-4 flex flex-col">
        <label>Since</label>
        <div>
          <input
            className="mb-4 mt-2 rounded border border-white bg-transparent p-2 focus:border-[var(--ifm-color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ifm-color-primary)]"
            type="date"
            value={opt.since || 0}
            onChange={(e) =>
              apply(
                Object.assign({}, opt, {
                  since: Math.floor(new Date(e.target.value).getTime() / 1000),
                }),
                baseUrl,
                router,
              )
            }
          />
          <button
            onClick={() =>
              apply(
                Object.assign({}, opt, {
                  since: undefined,
                }),
                baseUrl,
                router,
              )
            }
            className="m-2 mt-2 h-[42px] rounded bg-blue-500 p-2 hover:bg-blue-700"
          >
            reset
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <label>Until</label>
        <div>
          <input
            type="date"
            className="mb-4 mt-2 rounded border border-white bg-transparent p-2 focus:border-[var(--ifm-color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ifm-color-primary)]"
            value={opt.until || 0}
            onChange={(e) =>
              apply(
                Object.assign({}, opt, {
                  until: Math.floor(new Date(e.target.value).getTime() / 1000),
                }),
                baseUrl,
                router,
              )
            }
          />
          <button
            onClick={() =>
              apply(
                Object.assign({}, opt, {
                  until: undefined,
                }),
                baseUrl,
                router,
              )
            }
            className="m-2 mt-2 h-[42px] rounded bg-blue-500 p-2 hover:bg-blue-700"
          >
            reset
          </button>
        </div>
      </div>
    </div>
  )
}
