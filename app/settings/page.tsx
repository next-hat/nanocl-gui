"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ApiContext, instanceError, lastVersion } from "@/utils/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Icons } from "@/components/icons"

export default function SettingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const api = React.useContext(ApiContext)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [value, setValue] = React.useState<string>("")
  const error = searchParams.get("error")
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
    if (api.url) {
      setValue(api.url.replace(`/${lastVersion}`, ""))
    }
  }, [api.url, setValue])
  function onSubmit(e: React.FormEvent<any>) {
    e.preventDefault()
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
        router.push(`/settings?error=${err.message}`)
      })
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold leading-tight tracking-tighter">
          Settings
        </h1>
        <div className="flex">
          <Button
            title="save"
            disabled={`${value}/${lastVersion}` === api.url}
            onClick={onSubmit}
            className="size-6 p-0"
          >
            <Icons.save className="size-4" />
          </Button>
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <form onSubmit={onSubmit}>
          <div>
            <Label className="w-full font-medium" htmlFor="apiUrl">
              Api Version
            </Label>
            <Input
              type="text"
              id="apiUrl"
              placeholder="Api url"
              disabled
              defaultValue="v0.16.3"
              className="mt-2 w-[250px] lg:w-[450px]"
            />
          </div>
          <div className="pt-2">
            <Label className="w-full font-medium" htmlFor="apiUrl">
              Api Url
            </Label>
            <Input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              id="apiUrl"
              className="mt-2 w-[250px] lg:w-[450px]"
              placeholder="Api url"
            />
          </div>
          {error && (
            <p className="mb-4 max-w-full break-all text-center text-sm font-bold text-red-500">
              {error}
            </p>
          )}
          <Button type="submit" className="hidden" />
        </form>
      </div>
    </section>
  )
}
