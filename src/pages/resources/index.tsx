import React from "react"
import moment from "moment"
import Head from "next/head"
import { useRouter } from "next/router"

import { ApiContext } from "@/utils/api"

import PageTitle from "@/components/PageTitle"
import PageOverlay from "@/components/PageOverlay"

import Table from "@/components/Table"
import Button from "@/components/Button"
import ModalConfirm from "@/components/ModalConfirm"
import {
  PlusIcon,
  MinusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid"

export default function Resources() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const [data, setData] = React.useState<any[]>([])
  const [selected, setSelected] = React.useState<any>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false)

  React.useEffect(() => {
    api.instance
      .get("/resources")
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [api.instance, router])

  function onCloseDeleteConfirm() {
    setIsDeleteConfirmOpen(false)
  }

  async function onDeleteConfirm() {
    await api.instance
      .delete(`/resources/${selected.Name}`)
      .then(() => {
        return router.push("/resources")
      })
      .catch((err) => {
        const res = err?.response
        throw new Error(res?.data?.msg || res?.data || "An error occured")
      })
  }

  return (
    <>
      {isDeleteConfirmOpen ? (
        <ModalConfirm
          title="Are you sure to delete this resource ?"
          onClose={onCloseDeleteConfirm}
          onCancel={onCloseDeleteConfirm}
          onConfirm={onDeleteConfirm}
        />
      ) : null}
      <Head>
        <title>Resources | Nanocl Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.webp" />
      </Head>
      <main id="nano-main">
        <PageOverlay>
          <PageTitle>
            <div className="flex w-full justify-between">
              <div className="flex">
                <h3>Resources</h3>
              </div>
              <div className="flex">
                <Button
                  title="New"
                  className="min-w-fit bg-green-500 p-0 hover:bg-green-700"
                  onClick={() => {
                    router.push("/resources/new")
                  }}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </PageTitle>
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
                Name: "Actions",
                Key: "Actions",
                Render: (row: any) => (
                  <div className="flex">
                    <Button
                      title="Delete"
                      className="mr-2 min-w-fit bg-red-500 hover:bg-red-700"
                      onClick={() => {
                        setSelected(row)
                        setIsDeleteConfirmOpen(true)
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
      </main>
    </>
  )
}
