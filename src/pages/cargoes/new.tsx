import YAML from "yaml"
import React from "react"
import { useRouter } from "next/router"
import { PlusIcon } from "@heroicons/react/24/solid"

import MetaHeader from "@/components/MetaHeader"
import ModalConfirm from "@/components/ModalConfirm"
import PageOverlay from "@/components/PageOverlay"
import PageTitle from "@/components/PageTitle"
import YamlEditor from "@/components/YamlEditor"

import { ApiContext, instanceError } from "@/utils/api"

export default function Resource() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const [content, setContent] = React.useState<string>("")
  const [isSaveConfirmOpen, setSaveIsConfirmOpen] = React.useState(false)
  const haveNamespace = typeof router.query.Namespace !== "undefined"

  React.useEffect(() => {
    if (!router.isReady) return

    if (!haveNamespace) {
      router.push(`/cargoes/new?Namespace=global`)
      return
    }

    if (content === "") {
      const yaml = YAML.stringify({
        Name: "my-cargo",
        Container: {
          Image: "nginx:latest",
        },
      })
      setContent(yaml)
    }
  }, [content, router, haveNamespace, setContent])

  async function onSave() {
    const parsed = YAML.parse(content)
    await api.instance
      .post(`/cargoes?Namespace=${router.query.Namespace}`, parsed)
      .then(() => {
        router.push(`/cargoes`)
      })
      .catch((err) => {
        throw instanceError(err)
      })
  }

  function openOnSave() {
    if (content === "") return
    setSaveIsConfirmOpen(true)
  }

  function closeOnSave() {
    setSaveIsConfirmOpen(false)
  }

  function onChange(value: string | undefined) {
    setContent(value || "")
  }

  return (
    <>
      <MetaHeader title="New Cargo" />
      {isSaveConfirmOpen ? (
        <ModalConfirm
          title="Are you sure to save this cargo ?"
          onClose={closeOnSave}
          onConfirm={onSave}
        />
      ) : null}
      <PageOverlay>
        <PageTitle
          title="New Cargo"
          actions={[
            {
              title: "Save",
              onClick: openOnSave,
              className: "bg-green-500 hover:bg-green-700",
              icon: <PlusIcon className="h-4 w-4" />,
            },
          ]}
        />
        <YamlEditor isReadOnly={false} onChange={onChange}>
          {content}
        </YamlEditor>
      </PageOverlay>
    </>
  )
}
