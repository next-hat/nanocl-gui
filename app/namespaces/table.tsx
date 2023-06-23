"use client"

import React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ApiContext } from "@/utils/api"
import { MoreHorizontal } from "lucide-react"
import {
  DataTable,
  type ColumnDef,
} from "nanocl-gui-toolkit/components/data-table"
import { Button } from "nanocl-gui-toolkit/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "nanocl-gui-toolkit/components/ui/dropdown-menu"
import { Input } from "nanocl-gui-toolkit/components/ui/input"
import { useDebounce } from "nanocl-gui-toolkit/hooks/debounce"

import type { components } from "@/types/api-schema"
import { Icons } from "@/components/icons"

type NamespaceSummary = components["schemas"]["NamespaceSummary"]

export interface TableNamespacesProps {
  onDelete: (namespace: NamespaceSummary) => void
}

export function TableNamespaces({ onDelete }: TableNamespacesProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const api = React.useContext(ApiContext)
  const [namespaces, setNamespaces] = React.useState<NamespaceSummary[]>([])
  const [search, setSearch] = React.useState(searchParams.get("search") || "")
  const [_, debouncePushSearch] = useDebounce(500, null, pushSearch)

  React.useEffect(() => {
    if (!api.isLoaded) return
    api.instance
      .get<NamespaceSummary[]>(
        `/namespaces?Name=${searchParams.get("search") || ""}`
      )
      .then((res) => {
        setNamespaces(res.data)
      })
  }, [searchParams, api.isLoaded, api.instance, setNamespaces])

  const columns: ColumnDef<NamespaceSummary>[] = [
    {
      accessorKey: "Name",
      header: "Name",
    },
    {
      accessorKey: "Cargoes",
      header: "Cargoes",
    },
    {
      accessorKey: "Instances",
      header: "Instances",
    },
    {
      accessorKey: "Gateway",
      header: "Gateway",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const namespace = row.original
        return (
          <DropdownMenu>
            <div className="flex w-full justify-end">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Link href={`/namespaces/${namespace.Name}`} legacyBehavior>
                  <a className="row flex w-full items-center">
                    <Icons.eye className="pr-2" />
                    Inspect
                  </a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  onDelete(namespace)
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
    router.push(`/namespaces?search=${search}`)
  }

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    debouncePushSearch(e.target.value)
  }

  return (
    <>
      <Input
        title="Search"
        value={search}
        onChange={onSearch}
        placeholder="Search"
        className="w-[150px] lg:w-[250px]"
      />
      <DataTable data={namespaces} columns={columns} />
    </>
  )
}
