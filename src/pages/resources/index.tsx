import React from "react"
import moment from "moment"
import { useRouter } from "next/router"
import {
  PlusIcon,
  MinusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid"

import MetaHeader from "@/components/MetaHeader"
import ModalConfirm from "@/components/ModalConfirm"
import PageOverlay from "@/components/PageOverlay"
import PageTitle from "@/components/PageTitle"
import Table from "@/components/Table"
import Button from "@/components/Button"

import { ApiContext, instanceError } from "@/utils/api"

export default function Resources() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const [data, setData] = React.useState<any[]>([])

  const selectedAction = router.query.Action as string

  React.useEffect(() => {
    if (!api.url) return
    api.instance
      .get("/resources")
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [api.url, api.instance])

  const actions: Record<string, any> = {
    Delete: {
      title: "Are you sure to delete this resource ?",
      onConfirm: async () => {
        if (!router.query.Name) return
        await api.instance
          .delete(`/resources/${router.query.Name}`)
          .then(() => {
            return router.push("/resources")
          })
          .catch((err) => {
            throw instanceError(err)
          })
      },
    },
  }

  function closeModal() {
    router.push(`/resources`)
  }

  const action = actions[selectedAction]

  return (
    <>
      <MetaHeader title="Ressources" />
      {action ? (
        <ModalConfirm
          title={action.title}
          onClose={closeModal}
          onConfirm={action.onConfirm}
        />
      ) : null}
      <PageOverlay>
        <PageTitle
          title="Ressources"
          actions={[
            {
              title: "New",
              onClick: () => {
                router.push("/resources/new")
              },
              icon: <PlusIcon className="h-4 w-4" />,
              className: "bg-green-500 hover:bg-green-700",
            },
          ]}
        />
        <Table
          ID="Name"
          Data={data}
          Columns={[
            { Name: "Name", Key: "Name" },
            { Name: "Kind", Key: "Kind" },
            { Name: "Config Version", Key: "Version" },
            {
              Name: "Created at",
              Key: "CreatedAt",
              Render: (data) =>
                moment(data.CreatedAt).format("YYYY-MM-DD HH:mm:ss"),
            },
            {
              Name: "Updated at",
              Key: "UpdatedAt",
              Render: (data) =>
                moment(data.UpdatedAt).format("YYYY-MM-DD HH:mm:ss"),
            },
            {
              Name: "",
              Key: "Actions",
              Render: (row: any) => (
                <div className="flex justify-end">
                  <Button
                    title="Delete"
                    className="mr-2 min-w-fit bg-red-500 hover:bg-red-700"
                    onClick={() => {
                      router.push(`/resources?Action=Delete&Name=${row.Name}`)
                    }}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    title="Inspect"
                    className="min-w-fit bg-blue-500 hover:bg-blue-700"
                    onClick={() => {
                      router.push(`/resources/${row.Name}`)
                    }}
                  >
                    <MagnifyingGlassIcon className="h-4 w-4" />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </PageOverlay>
    </>
  )
}
