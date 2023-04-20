import React from "react"
import { useRouter } from "next/router"
import YAML from "yaml"
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

  const selectedAction = router.query.Action as string

  React.useEffect(() => {
    if (!router.isReady) return

    if (content === "") {
      const yaml = YAML.stringify({
        Name: "my-resource",
        Version: "v0.1",
        Kind: "ProxyRule",
        Config: {},
      })
      setContent(yaml)
    }
  }, [content, router.isReady])

  const actions: Record<string, any> = {
    New: {
      title: "New Resource",
      onConfirm: async () => {
        const parsed = YAML.parse(content)
        await api.instance
          .post(`/resources`, parsed)
          .then(() => {
            return router.push(`/resources`)
          })
          .catch((err) => {
            throw instanceError(err)
          })
      },
    },
  }

  function closeModal() {
    router.push(`/resources/new`)
  }

  function openModalNew() {
    router.push(`/resources/new?Action=New`)
  }

  function onChange(value: string | undefined) {
    setContent(value || "")
  }

  const action = actions[selectedAction]

  return (
    <>
      <MetaHeader title="New Resource" />
      {action ? (
        <ModalConfirm
          title={action.title}
          onClose={closeModal}
          onCancel={closeModal}
          onConfirm={action.onConfirm}
        />
      ) : null}
      <PageOverlay>
        <PageTitle
          title="New Resource"
          actions={[
            {
              title: "New",
              onClick: openModalNew,
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
