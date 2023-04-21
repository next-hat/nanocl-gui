import React from "react"
import { useRouter } from "next/router"
import YAML from "yaml"
import Editor from "@monaco-editor/react"

import { ApiContext, instanceError } from "@/utils/api"

import PageTitle from "@/components/PageTitle"
import PageOverlay from "@/components/PageOverlay"
import ModalConfirm from "@/components/ModalConfirm"
import MetaHeader from "@/components/MetaHeader"
import { getQs } from "@/utils/qs"

export default function Cargo() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const [data, setData] = React.useState<string | null>(null)
  const [oldData, setOldData] = React.useState<string | null>(null)

  const confirmAction = router.query.ConfirmAction as string

  React.useEffect(() => {
    if (!api.url || !router.isReady || oldData) return

    api.instance
      .get(
        `/cargoes/${router.query.name}/inspect?Namespace=${router.query.Namespace}`,
      )
      .then((res) => {
        const yaml = YAML.stringify({
          Replication: res.data.Config.Replication,
          Container: res.data.Config.Container,
        })
        setOldData(yaml)
        setData(yaml)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [oldData, api.url, api.instance, router])

  const closeModal = () => {
    return router.push(
      `/cargoes/${router.query.name}/edit?Namespace=${router.query.Namespace}`,
    )
  }

  const setConfirmAction = (action: string) => {
    return router.push(
      `/cargoes/${router.query.name}/edit?Namespace=${router.query.Namespace}&ConfirmAction=${action}`,
    )
  }

  const confirmActions: Record<string, any> = {
    Save: {
      title: "Are you sure to save this cargo ?",
      onConfirm: async () => {
        await api.instance
          .put(`/cargoes/${router.query.name}`, YAML.parse(data || ""))
          .then(() => {
            return closeModal()
          })
          .catch((err) => {
            throw instanceError(err)
          })
      },
    },
    Cancel: {
      title: "This action will discard all changes. Are you sure ?",
      onConfirm: async () => {
        setData(oldData)
        return closeModal()
      },
    },
  }

  return (
    <>
      <MetaHeader title={`Cargo ${getQs(router.query.name) || ""}`} />
      {confirmAction ? (
        <ModalConfirm
          title={confirmActions[confirmAction].title}
          onClose={closeModal}
          onConfirm={confirmActions[confirmAction].onConfirm}
        />
      ) : null}
      <PageOverlay>
        <PageTitle
          title={`Cargo ${getQs(router.query.name) || ""}`}
          actions={[
            {
              title: "Cancel",
              className: "mr-2 bg-red-500 hover:bg-red-700",
              onClick: () => {
                setConfirmAction("Cancel")
              },
            },
            {
              title: "Save",
              className: "bg-green-500 hover:bg-green-700",
              onClick: () => {
                setConfirmAction("Save")
              },
            },
          ]}
        />
        {data ? (
          <Editor
            theme="vs-dark"
            height="80vh"
            defaultLanguage="yaml"
            value={data}
            onChange={(value) => {
              setData(value || "")
            }}
          />
        ) : null}
      </PageOverlay>
    </>
  )
}
