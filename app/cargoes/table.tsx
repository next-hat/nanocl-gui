"use client"

import React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ApiContext } from "@/utils/api"
import { Folder, MoreHorizontal, Search } from "lucide-react"
import moment from "moment"
import {
  DataTable,
  type ColumnDef,
} from "@/components/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/debounce"

import type { components } from "@/types/api-schema"
import { Icons } from "@/components/icons"

type CargoSummary = components["schemas"]["CargoSummary"]
type NamespaceSummary = components["schemas"]["NamespaceSummary"]

export interface TableCargoesProps {
  onDelete: (namespace: CargoSummary) => void
}

export function TableCargoes({ onDelete }: TableCargoesProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const api = React.useContext(ApiContext)
  const [search, setSearch] = React.useState(searchParams.get("search") || "")
  const [_, debouncePushSearch] = useDebounce(500, null, pushSearch)
  const [searchNamespace, setSearchNamespace] = React.useState("")
  const [namespaces, setNamespaces] = React.useState<NamespaceSummary[]>([])
  const [namespaceName, debounceSearchNamespace] = useDebounce(500, null)
  const [cargoes, setCargos] = React.useState<CargoSummary[]>([])
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const [selectedNamespace, setSelectedNamespace] = React.useState(
    searchParams.get("namespace") || ""
  )

  /// Search cargoes
  React.useEffect(() => {
    if (!api.isLoaded) return
    const namespace = searchParams.get("namespace")
    if (!namespace) return router.replace("/cargoes?namespace=global")
    setSelectedNamespace(namespace)
    api.instance
      .get<CargoSummary[]>(
        `/cargoes?Namespace=${namespace}&Name=${
          searchParams.get("search") || ""
        }`
      )
      .then((res) => {
        setCargos(res.data)
      })
  }, [router, searchParams, api.isLoaded, api.instance, setCargos])

  /// Search namespaces
  React.useEffect(() => {
    if (!api.isLoaded) return
    if (!namespaceName || namespaceName === "") return setNamespaces([])
    api.instance
      .get<NamespaceSummary[]>(`/namespaces?Name=${namespaceName}`)
      .then((res) => {
        setNamespaces(res.data)
      })
  }, [api.isLoaded, api.instance, namespaceName])

  const columns: ColumnDef<CargoSummary>[] = [
    {
      accessorKey: "Name",
      header: "Name",
    },
    {
      header: "Image",
      cell: ({ row }) => row.original.Spec.Container.Image || "n/a",
    },
    {
      header: "Intances",
      cell: ({ row }) =>
        `[ ${row.original.InstanceRunning} / ${row.original.InstanceTotal} ]`,
    },
    {
      header: "Version",
      cell: ({ row }) => row.original.Spec.Version,
    },
    {
      header: "Created at",
      cell: ({ row }) => moment.utc(row.original.CreatedAt).tz(tz).fromNow(),
    },
    {
      header: "Updated at",
      cell: ({ row }) => moment.utc(row.original.Status.UpdatedAt).tz(tz).fromNow(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const resource = row.original
        return (
          <DropdownMenu>
            <div className="flex w-full justify-end">
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="selected:outline-none size-8 border-0 p-0"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  href={`/cargoes/${resource.Spec.CargoKey}?namespace=${selectedNamespace}`}
                  legacyBehavior
                >
                  <a className="row flex w-full items-center">
                    <Icons.eye className="pr-2" />
                    Inspect
                  </a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  onDelete(resource)
                }}
              >
                <Icons.trash className="pr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  async function pushSearch(search: string) {
    router.push(`/cargoes?namespace=${selectedNamespace}&search=${search}`)
  }

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    debouncePushSearch(e.target.value)
  }

  function onSearchNamespace(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchNamespace(e.target.value)
    debounceSearchNamespace(e.target.value)
  }

  return (
    <>
      <div className="row flex">
        <Input
          title="Search"
          value={search}
          onChange={onSearch}
          placeholder="Search"
          className="mr-2 w-[150px] lg:w-[250px]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <Button
                variant="outline"
                title="Search namespace"
                size="sm"
                className="ml-auto hidden h-8 lg:flex"
              >
                <Folder className="mr-2 size-4" />
                <span>Namespace {selectedNamespace}</span>
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[250px]">
            <div className="row flex items-center">
              <Search className="mr-2 size-4 shrink-0 opacity-50" />
              <Input
                title="Search namespace"
                placeholder="Search namespace"
                value={searchNamespace}
                onChange={onSearchNamespace}
              />
            </div>
            {namespaces.length ? (
              <>
                <DropdownMenuSeparator />
                {namespaces.map((ns) => (
                  <DropdownMenuItem
                    key={ns.Name}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedNamespace(ns.Name)
                      router.push(
                        `/cargoes?namespace=${ns.Name}&search=${search}`
                      )
                    }}
                  >
                    <span className="row flex w-full items-center">
                      <Folder className="pr-2" />
                      {ns.Name}
                    </span>
                  </DropdownMenuItem>
                ))}
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DataTable data={cargoes} columns={columns} />
    </>
  )
}
