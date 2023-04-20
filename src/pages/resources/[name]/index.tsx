import React from "react"
import { useRouter } from "next/router"
import YAML from "yaml"
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/solid"

import { ApiContext, instanceError } from "@/utils/api"

import MetaHeader from "@/components/MetaHeader"
import ModalConfirm from "@/components/ModalConfirm"
import PageOverlay from "@/components/PageOverlay"
import PageTitle from "@/components/PageTitle"
import YamlEditor from "@/components/YamlEditor"

export default function Resource() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const [content, setContent] = React.useState<string>("")
  const [oldContent, setOldContent] = React.useState<string>("")

  const selectedAction = router.query.Action as string
  const isEdit = router.query.Mode === "Edit"
  const isEdited = content !== oldContent

  React.useEffect(() => {
    if (!api.url || !router.isReady) return
    api.instance
      .get(`/resources/${router.query.name}`)
      .then((res) => {
        let data = res.data
        const cpy = { ...data }
        if (isEdit) {
          delete cpy.Name
          delete cpy.UpdatedAt
          delete cpy.CreatedAt
          delete cpy.Kind
          delete cpy.ConfigKey
        }
        const yaml = YAML.stringify(cpy)
        setContent(yaml)
        setOldContent(yaml)
      })
      .catch((err) => {
        // Todo: Handle error
        console.error(err)
      })
  }, [
    api.url,
    api.instance,
    router.isReady,
    router.query.name,
    isEdit,
    setContent,
  ])

  const actions: Record<string, any> = {
    SaveEdit: {
      title: "Confirm Resource Edition ?",
      onConfirm: async () => {
        const parsed = YAML.parse(content)
        await api.instance
          .patch(`/resources/${router.query.name}`, parsed)
          .then((res) => {
            router.push(`/resources/${router.query.name}`)
          })
          .catch((err) => {
            throw instanceError(err)
          })
      },
    },
  }

  function closeModal() {
    router.push(`/resources/${router.query.name}`)
  }

  const action = actions[selectedAction]

  return (
    <>
      <MetaHeader title={`Resource ${router.query.name}`} />
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
          title="Resource"
          actions={[
            {
              title: "Edit",
              icon: <PencilIcon className="h-4 w-4" />,
              onClick: () => {
                router.push(`/resources/${router.query.name}?Mode=Edit`)
              },
              className: "bg-blue-500 hover:bg-blue-700",
              isDisabled: isEdit,
            },
            {
              title: "Cancel",
              icon: <XMarkIcon className="h-4 w-4" />,
              onClick: () => {
                router.push(`/resources/${router.query.name}`)
              },
              className: "ml-2 bg-red-500 hover:bg-red-700",
              isDisabled: !isEdit,
            },
            {
              title: "Save",
              icon: <PencilIcon className="h-4 w-4" />,
              onClick: () => {
                router.push(
                  `/resources/${router.query.name}?Mode=Edit&Action=SaveEdit`,
                )
              },
              className: "ml-2 bg-blue-500 hover:bg-blue-700",
              isDisabled: !isEdited,
            },
          ]}
        />
        <YamlEditor
          isReadOnly={!isEdit}
          onChange={(value) => {
            setContent(value || "")
          }}
        >
          {content}
        </YamlEditor>
      </PageOverlay>
    </>
  )
}
