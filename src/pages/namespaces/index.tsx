import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import {
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid"
import { ApiContext, instanceError } from "@/utils/api"
import type * as Types from "@/utils/types"

import MetaHeader from "@/components/MetaHeader"
import ModalConfirm from "@/components/ModalConfirm"
import ModalInput from "@/components/ModalInput"
import PageTitle from "@/components/PageTitle"
import PageOverlay from "@/components/PageOverlay"
import Table from "@/components/Table"
import Button from "@/components/Button"

export default function Namespaces() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const isCreateOpen = typeof router.query.Create !== "undefined"
  const isDeleteOpen = typeof router.query.Delete !== "undefined"
  const [namespaces, setNamespaces] = React.useState<Types.NamespaceRow[]>([])

  React.useEffect(() => {
    if (!api.url || !router.isReady || isCreateOpen || isDeleteOpen) return
    api.instance.get("/namespaces").then((res) => {
      setNamespaces(res.data)
    })
  }, [
    api.url,
    api.instance,
    router.isReady,
    isCreateOpen,
    isDeleteOpen,
    setNamespaces,
  ])

  function closeModal() {
    router.push("/namespaces")
  }

  async function onCreate(value: string) {
    await api.instance
      .post("/namespaces", { Name: value })
      .then(() => {
        closeModal()
      })
      .catch((err) => {
        throw instanceError(err)
      })
  }

  async function onDelete() {
    await api.instance
      .delete(`/namespaces/${router.query.Delete}`)
      .then(() => {
        closeModal()
      })
      .catch((err) => {
        const res = err?.response
        throw new Error(
          res?.data?.msg || res?.data || err.message || "An error occured",
        )
      })
  }

  return (
    <>
      <MetaHeader title="Namespaces" />
      {isDeleteOpen ? (
        <ModalConfirm
          title={`Are you sure to delete ${router.query.Delete} ?`}
          onClose={closeModal}
          onConfirm={onDelete}
        />
      ) : null}
      {isCreateOpen ? (
        <ModalInput
          title="Create a new namespace"
          label="Name"
          placeholder="my-namespace"
          onClose={closeModal}
          onConfirm={onCreate}
        />
      ) : null}
      <PageOverlay>
        <PageTitle
          title="Namespaces"
          actions={[
            {
              title: "New",
              icon: <PlusIcon className="h-4 w-4" />,
              onClick: () => {
                router.push("/namespaces?Create")
              },
              className: "bg-green-500 hover:bg-green-700",
            },
          ]}
        />
        <Table
          ID="Name"
          Data={namespaces}
          Columns={[
            { Name: "Name", Key: "Name" },
            { Name: "Gateway", Key: "Gateway" },
            { Name: "Instances", Key: "Instances" },
            { Name: "Cargoes", Key: "Cargoes" },
            {
              Name: "Actions",
              Key: "Actions",
              Render: (row: any) => (
                <div className="flex">
                  <Button
                    title="Delete"
                    className="mr-2 min-w-fit bg-red-500 hover:bg-red-700"
                    onClick={() => {
                      router.push(`/namespaces?Delete=${row.Name}`)
                    }}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    title="Inspect"
                    className="min-w-fit bg-blue-500 hover:bg-blue-700"
                    onClick={() => {
                      router.push(`/namespaces/${row.Name}`)
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
