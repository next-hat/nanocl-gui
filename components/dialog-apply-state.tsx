"use client"

import React from "react"
import { ApiContext, createNanoclDecoder } from "@/utils/api"
import { Liquid } from "liquidjs"
import debounce from "lodash/debounce"
import { Button } from "nanocl-gui-toolkit/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "nanocl-gui-toolkit/components/ui/dialog"
import { Input } from "nanocl-gui-toolkit/components/ui/input"
import { Label } from "nanocl-gui-toolkit/components/ui/label"
import YAML from "yaml"

import Console from "./console"

export type DialogStateProps = {
  open: boolean
  state: string
  onOpenChange: () => void
}

export function DialogApplyState({
  open,
  state,
  onOpenChange,
}: DialogStateProps) {
  const api = React.useContext(ApiContext)
  const [formConfig, setFormConfig] = React.useState<any>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [output, setOutput] = React.useState<string | null>(null)
  const [isFinished, setIsFinished] = React.useState(false)
  const [isStarted, setIsStarted] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      const json = YAML.parse(state)
      if (json.Args?.length > 0) {
        setFormConfig(json.Args)
      }
    }
  }, [open, state])

  function applyState(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const Args = formConfig?.reduce((acc: any, arg: any) => {
      const input = e.currentTarget.querySelector(
        `[data-key="${arg.Name}"]`
      ) as HTMLInputElement
      acc[arg.Name] = input.value.length ? input.value : undefined
      return acc
    }, {})
    const engine = new Liquid({
      strictFilters: true,
      strictVariables: true,
    })
    const tpl = engine.parse(state.replace(/\$\{\{(.+?)\}\}/gm, "{{ $1 }}"))
    engine
      .render(tpl, { Args })
      .then(async (value) => {
        setError(null)
        setIsStarted(true)
        const state = YAML.parse(value)
        setOutput("====> Applying state\n")
        setTimeout(async () => {
          if (state.Cargoes?.length) {
            for (let cargo of state.Cargoes) {
              try {
                await api.instance.get(
                  `/cargoes/images/${cargo.Container.Image}`
                )
                continue
              } catch (e) {}

              const bodyString = JSON.stringify({
                Name: cargo?.Container?.Image,
              })
              const res = await fetch(`${api.url}/cargoes/images`, {
                method: "POST",
                body: bodyString,
                headers: new Headers({
                  "Content-Type": "application/json",
                }),
              })
              const decoder = createNanoclDecoder((data) => {
                let s = data.status
                if (data.progress) {
                  s += `: ${data.progress}`
                }
                s += `\n`
                return s
              })
              const updateOutput = () => {
                setOutput((prev) => prev + decoder.parse())
              }
              const next = debounce(updateOutput, 100, {
                leading: false,
                trailing: true,
                maxWait: 5000,
              })
              for await (const chunk of res.body as any) {
                const { isDone } = decoder.decode(chunk, { stream: true })
                if (isDone) {
                  next()
                }
              }
            }

            const res = await fetch(`http://localhost:8585/v0.5/state/apply`, {
              method: "PUT",
              body: JSON.stringify(state),
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            })
            const decoder = createNanoclDecoder((data) => {
              let s = ""
              if (data.Error) {
                s += `\x1b[1;31m${data.Error}\x1b[0m\n`
              }
              if (data.Msg) {
                s += `${data.Msg}\n`
              }
              return s
            })
            const updateOutput = () => {
              setOutput((prev) => prev + decoder.parse())
            }
            const next = debounce(updateOutput, 100, {
              leading: false,
              trailing: true,
              maxWait: 5000,
            })
            for await (const chunk of res.body as any) {
              const { isDone } = decoder.decode(chunk, { stream: true })
              if (isDone) {
                next()
              }
            }
            setIsFinished(true)
          }
        }, 1000)
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  function hookOpenOnChange() {
    if (!isStarted || isFinished) {
      setOutput(null)
      setIsFinished(false)
      setIsStarted(false)
      onOpenChange()
    }
  }

  return (
    <Dialog open={open} onOpenChange={hookOpenOnChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>State Apply</DialogTitle>
          <DialogDescription>
            Apply your change to the state of the cluster, note that
            environement variables are not supported.
          </DialogDescription>
        </DialogHeader>
        {!output ? (
          <form onSubmit={applyState} className="grid gap-4">
            {formConfig && (
              <>
                <h2 className="text-sm font-bold">Arguments</h2>
                <div className="grid max-h-[420px] gap-4 overflow-auto p-6 py-4">
                  {formConfig.map((arg: any, i: number) => {
                    return (
                      <div
                        key={`args-${i}`}
                        className="grid grid-cols-4 items-center gap-4"
                      >
                        <Label htmlFor={arg.Name} className="text-right">
                          {arg.Name}
                        </Label>
                        <Input
                          data-key={arg.Name}
                          type="text"
                          id={arg.Name}
                          className="col-span-3"
                        />
                      </div>
                    )
                  })}
                </div>
              </>
            )}
            <p className="text-sm text-red-500">{error}</p>
            <DialogFooter>
              <Button type="submit">Apply</Button>
            </DialogFooter>
          </form>
        ) : (
          <Console
            className="max-h-[240px] min-h-[240px]"
            id="StateLogs"
            data={output}
            enableStream
          />
        )}
        <DialogFooter>
          {isFinished && <Button onClick={hookOpenOnChange}>Close</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
