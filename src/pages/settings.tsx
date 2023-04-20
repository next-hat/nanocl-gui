import React from "react"
import { useRouter } from "next/router"

import MetaHeader from "@/components/MetaHeader"
import PageOverlay from "@/components/PageOverlay"
import PageTitle from "@/components/PageTitle"
import Button from "@/components/Button"

import { ApiContext, lastVersion, instanceError } from "@/utils/api"

export default function Settings() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [value, setValue] = React.useState<string>("")
  const error = router.query.Error as string

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
    if (api.url) {
      setValue(api.url.replace(`/${lastVersion}`, ""))
    }
  }, [api.url])

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    // prevent page reload
    e.preventDefault()
    // clear error
    router.push("/settings")
    // Try to to ping api
    const url = `${value}/${lastVersion}/_ping`
    api.instance
      .head(url)
      .then((res) => {
        if (res.status !== 202) {
          throw instanceError(res)
        }
        // Save api url to local storage if ping is successful
        window.localStorage.setItem("API_URL", value)
        return router.push("/")
      })
      .catch((err) => {
        const e = instanceError(err)
        router.push(`/settings?Error=${e.message}`)
      })
  }

  return (
    <>
      <MetaHeader title="Settings" />
      <PageOverlay>
        <PageTitle title="Settings" />
        <form className="mt-4 flex flex-col" onSubmit={onSubmit}>
          <label className="text-[var(--ifm-color-emphasis-500)]] text-xl font-bold">
            {">"} Required Api Version
          </label>
          <p className="mb-4 mt-2 rounded border border-white bg-transparent p-2">
            {lastVersion}
          </p>
          <label className="text-[var(--ifm-color-emphasis-500)]] text-xl font-bold">
            {">"} Api Url
          </label>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={onChange}
            placeholder="http://api.nanocl.internal"
            className="mb-4 mt-2 rounded border border-white bg-transparent p-2 focus:border-[var(--ifm-color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ifm-color-primary)]"
          />
          {error && (
            <p className="mb-4 max-w-full break-all text-center text-sm font-bold text-red-500">
              {error}
            </p>
          )}
          <Button
            className="h-[42px] bg-green-500 hover:bg-green-700"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </PageOverlay>
    </>
  )
}
