"use client"

import React from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ApiContext } from "@/utils/api"
import { Folder, MoreHorizontal, Search } from "lucide-react"
import moment from "moment"
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

import type { components } from "@/types/api-schema"
import { containerColorState } from "@/config/container-color-state"
import { Icons } from "@/components/icons"

type CargoInspect = components["schemas"]["CargoInspect"]
type NodeContainerSummary = components["schemas"]["NodeContainerSummary"]

export interface TableCargoesProps {
  onDelete: (namespace: CargoInspect) => void
}

export function InfoCargo({ onDelete }: TableCargoesProps) {
  const params = useParams()
  const searchParams = useSearchParams()
  const api = React.useContext(ApiContext)
  const [cargo, setCargo] = React.useState<CargoInspect | null>(null)
  const namespace = searchParams.get("namespace") || "global"

  React.useEffect(() => {
    if (!api.isLoaded) return
    api.instance
      .get<CargoInspect>(
        `/cargoes/${params.name}/inspect?Namespace=${
          searchParams.get("namespace") || "global"
        }`
      )
      .then((res) => {
        setCargo(res.data)
      })
  }, [searchParams, api.isLoaded, api.instance, params.name, setCargo])

  const columns: ColumnDef<NodeContainerSummary>[] = [
    {
      header: "Status",
      id: "status",
      cell: ({ row }) => (
        <div className="flex flex-row items-center">
          <span
            className="mr-2 h-2 w-2 animate-pulse rounded-full"
            style={{
              backgroundColor:
                containerColorState[row.original?.Container?.State || "none"],
            }}
          />
          <span>{row.original.Container.Status || "n/a"}</span>
        </div>
      ),
    },
    {
      header: "Node",
      id: "node",
      cell: ({ row }) => (
        <div className="flex flex-row items-center">
          <span>{row.original.Node || "n/a"}</span>
        </div>
      ),
    },
    {
      header: "Ip address",
      id: "ip_address",
      cell: ({ row }) => {
        const network = row.original?.Container?.NetworkSettings
          ?.Networks as any

        const ipam = network && network[namespace] && network[namespace]
        const ipAddress =
          (ipam && ipam.IPAddress) || (network["host"] && "host") || "n/a"

        return (
          <div className="flex flex-row items-center">
            <span>{ipAddress}</span>
          </div>
        )
      },
    },
    {
      header: "Created at",
      id: "created_at",
      cell: ({ row }) =>
        (row.original.Container.Created &&
          moment.unix(row.original.Container.Created).fromNow()) ||
        "n/a",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const name =
          ((row.original?.Container?.Names as any)[0] || "")
            .replace("/", "")
            .split(".")[0] + (row.index ? `-${row.index}` : "")
        return (
          <DropdownMenu>
            <div className="flex w-full justify-end">
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="selected:outline-none h-8 w-8 border-0 p-0"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  href={`/cargoes/${name}/logs?namespace=${namespace}`}
                  legacyBehavior
                >
                  <a className="row flex w-full items-center">
                    <Icons.eye className="pr-2" />
                    Logs
                  </a>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="">
        <h1 className="text-2xl font-extrabold leading-tight tracking-tighter">
          {cargo?.Name}
        </h1>
        <h2>{cargo?.Config?.Container?.Image}</h2>
      </div>
      {cargo ? (
        <DataTable data={cargo?.Instances || []} columns={columns} />
      ) : null}
    </section>
  )
}
