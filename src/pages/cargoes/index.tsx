import React from "react"
import { useRouter } from "next/router"
import moment from "moment"
import { debounce } from "lodash"
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid"

import { ApiContext } from "@/utils/api"

import MetaHeader from "@/components/MetaHeader"
import PageOverlay from "@/components/PageOverlay"
import PageTitle from "@/components/PageTitle"
import Table from "@/components/Table"
import Button from "@/components/Button"

export default function Metrics() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const [data, setData] = React.useState<any[]>([])
  const [namespace, setNameSpace] = React.useState<string>("")
  const [namespaces, setNamespaces] = React.useState<any[]>([])

  function searchNamespace(val: string) {
    api.instance.get(`/namespaces?Name=${val}`).then((res) => {
      setNamespaces(res.data)
    })
  }

  const debouncedSearch = debounce(searchNamespace, 1000, {
    leading: false,
    trailing: true,
  })

  React.useEffect(() => {
    if (!api.url || !router.isReady) return

    if (!router.query.Namespace) {
      router.replace("/cargoes?Namespace=global")
      return
    }

    api.instance
      .get(`/cargoes?Namespace=${router.query.Namespace}`)
      .then((res) => {
        setNameSpace(router.query.Namespace as string)
        setData(res.data)
      })
  }, [api.url, api.instance, router, setData, setNameSpace])

  return (
    <>
      <MetaHeader title="Cargoes" />
      <PageOverlay>
        <PageTitle
          title="Cargoes"
          actions={[
            {
              title: "New",
              icon: <PlusIcon className="h-4 w-4" />,
              onClick: () => {
                router.push(`/cargoes/new?Namespace=${namespace}`)
              },
              className: "bg-green-500 hover:bg-green-700",
            },
          ]}
        />
        <div className="mb-[25px] ml-2 max-w-[400px]">
          <div className="relative w-full">
            <ul className="absolute top-[46px] max-h-[200px] w-full overflow-auto rounded bg-[var(--ifm-background-secondary-color)] shadow-lg">
              {namespaces.map((ns) => (
                <li
                  key={ns.Name}
                  className="cursor-pointer border-b border-[var(--ifm-color-emphasis-300)] p-2 text-base last:border-b-0 hover:bg-[rgba(255,255,255,0.1)]"
                  onClick={() => {
                    setNamespaces([])
                    router.push(`/cargoes?Namespace=${ns.Name}`)
                  }}
                >
                  {ns.Name}
                </li>
              ))}
            </ul>
          </div>
          <input
            className="w-full rounded border border-white bg-transparent p-2 focus:border-[var(--ifm-color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ifm-color-primary)]"
            type="text"
            autoComplete="off"
            onChange={(e) => {
              setNameSpace(e.target.value)
              debouncedSearch(e.target.value)
            }}
            value={namespace}
          />
        </div>
        <Table
          ID="Name"
          Data={data}
          Columns={[
            { Name: "Name", Key: "Name" },
            {
              Name: "Image",
              Key: "Image",
              Render: (data) => data.Config.Container.Image,
            },
            {
              Name: "Instances",
              Key: "InstanceRunning",
              Render: (data) =>
                `[ ${data.InstanceRunning} / ${data.InstanceTotal} ]`,
            },
            {
              Name: "Version",
              Key: "Version",
              Render: (data) => data.Config.Version,
            },
            {
              Name: "Created at",
              Key: "CreatedAt",
              Render: (row: any) => moment(row.CreatedAt).fromNow(),
            },
            {
              Name: "Updated at",
              Key: "UpdatedAt",
              Render: (row: any) => moment(row.UpdatedAt).fromNow(),
            },
            {
              Name: "",
              Key: "Actions",
              Render: (row: any) => (
                <div className="flex justify-end">
                  <Button
                    title="Inspect"
                    className="min-w-fit bg-blue-500 hover:bg-blue-700"
                    onClick={() => {
                      router.push(
                        `/cargoes/${row.Name}?Namespace=${row.NamespaceName}`,
                      )
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
