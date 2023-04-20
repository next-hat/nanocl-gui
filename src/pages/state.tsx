import React from "react"
import { useRouter } from "next/router"
import YAML from "yaml"
import { debounce } from "lodash"
import { Editor } from "@monaco-editor/react"
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid"

import MetaHeader from "@/components/MetaHeader"
import ModalConfirm from "@/components/ModalConfirm"
import PageOverlay from "@/components/PageOverlay"
import PageTitle from "@/components/PageTitle"
import Console from "@/components/Console"

import { ApiContext, lastVersion, createNanoclDecoder } from "@/utils/api"

const defaultState = `Type: Deployment
ApiVersion: ${lastVersion}

Namespace: global

# See all options:
# https://docs.next-hat.com/references/nanocl/daemon/v0.4#tag/Cargoes/operation/create_cargo
Cargoes:
- Name: nginx
  Container:
    Image: nginx:latest

# See all options:
# https://docs.next-hat.com/references/nanocl/daemon/v0.4#tag/Resources/operation/create_resource
Resources:
- Name: nginx.example.com
  Kind: ProxyRule
  Version: v0.1
  Config:
    Watch:
    - nginx.global
    Rule:
      Http:
        Domain: nginx.example.com
        Network: Public
        Locations:
        - Path: /
          Target:
            Cargo:
              Key: nginx.global
              Port: 80
`

export default function Metrics() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const [value, setValue] = React.useState<string>(defaultState)
  const [output, setOutput] = React.useState<string>("")

  const e = router.query.Action as string

  const actions: Record<string, any> = {
    Apply: {
      title: "Are you sure to apply this state ?",
      onConfirm: async () => {
        const state = YAML.parse(value)
        router.push(`/state`)
        setOutput("====> Applying state\n")
        setTimeout(async () => {
          if (state.Cargoes.length) {
            for (let cargo of state.Cargoes) {
              const res = await fetch(`${api.url}/cargoes/images`, {
                method: "POST",
                body: JSON.stringify({
                  Name: cargo.Container.Image,
                }),
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
              console.log(data)
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
          }
        }, 500)
      },
    },
    Revert: {
      title: "Are you sure to revert this state ?",
      onConfirm: async () => {
        const state = YAML.parse(value)
        router.push(`/state`)
        setOutput("====> Reverting state\n")
        setTimeout(async () => {
          const res = await fetch(`http://localhost:8585/v0.5/state/revert`, {
            method: "PUT",
            body: JSON.stringify(state),
            headers: new Headers({
              "Content-Type": "application/json",
            }),
          })
          const decoder = createNanoclDecoder((data) => {
            console.log(data)
            let s = ""
            if (data.Err) {
              s += `\x1b[31;1;4m[ERROR]\x1b[0m: ${data.Err}\n`
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
        }, 500)
      },
    },
  }

  function onCloseModal() {
    router.push("/state")
  }

  const action = actions[e]

  return (
    <>
      <MetaHeader title="State" />
      {action ? (
        <ModalConfirm
          title={action.title}
          onClose={onCloseModal}
          onCancel={onCloseModal}
          onConfirm={action.onConfirm}
        />
      ) : null}
      <PageOverlay>
        <PageTitle
          title="State"
          actions={[
            {
              title: "Revert",
              className: "mr-2 bg-red-500 hover:bg-red-700",
              icon: <MinusIcon className="h-4 w-4" />,
              onClick: () => {
                router.push("/state?Action=Revert")
              },
            },
            {
              title: "Apply",
              className: "bg-green-500 hover:bg-green-700",
              icon: <PlusIcon className="h-4 w-4" />,
              onClick: () => {
                router.push("/state?Action=Apply")
              },
            },
          ]}
        ></PageTitle>
        <div className="flex h-full flex-row">
          <Editor
            theme="vs-dark"
            height="76vh"
            defaultLanguage="yaml"
            value={value}
            onChange={(s) => setValue(s || "")}
          />
          <div className="min-w-[10px]" />
          <Console data={output} />
        </div>
      </PageOverlay>
    </>
  )
}
