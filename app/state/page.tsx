"use client"

import React from "react"
import { ApiContext, createNanoclDecoder, lastVersion } from "@/utils/api"
import { useCtrlS } from "nanocl-gui-toolkit/hooks/ctrl-s"
import { Button } from "nanocl-gui-toolkit/src/components/ui/button"

import { DialogApplyState } from "@/components/dialog-apply-state"
import { Icons } from "@/components/icons"
import { YamlEditor } from "@/components/yaml-editor"

const defaultState =
  `Type: Deployment
ApiVersion: ${lastVersion}

Namespace: global

Args:
- Name: domain
  Type: String

  # See all options:
# https://docs.next-hat.com/references/nanocl/cargo
Cargoes:
- Name: nginx
  Container:
    Image: nginx:latest

# See all options:
# https://docs.next-hat.com/references/nanocl/resource
Resources:
- Name: ` +
  "${{ Args.domain }}" +
  `
  Kind: ProxyRule
  Version: v0.1
  Config:
    Watch:
    - nginx.global
    Rules:
    - Domain: ` +
  "${{ Args.domain }}" +
  `
      Network: Public
      Locations:
      - Path: /
        Target:
          CargoKey: nginx.global
          CargoPort: 80`

export default function StatePage() {
  const api = React.useContext(ApiContext)
  const [applyOpen, setApplyOpen] = React.useState(false)
  const [state, setState] = React.useState(defaultState)
  function onOpenChange() {
    setApplyOpen(!applyOpen)
  }

  useCtrlS(() => {
    if (applyOpen) return
    setApplyOpen(!applyOpen)
  })

  return (
    <>
      <DialogApplyState
        open={applyOpen}
        state={state}
        onOpenChange={onOpenChange}
      />
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter">
            State
          </h1>
          <div className="flex">
            <Button title="save" onClick={onOpenChange} className="h-6 w-6 p-0">
              <Icons.save className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <YamlEditor onChange={(e) => setState(e ?? "")}>{state}</YamlEditor>
      </section>
    </>
  )
}
