"use client"

import React from "react"
import Link from "next/link"
import { ApiContext } from "@/utils/api"
import { MoreHorizontal } from "lucide-react"
import {
  DataTable,
  type ColumnDef,
} from "@/components/data-table"
import { ModalConfirm } from "@/components/modal-confirm"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { components } from "@/types/api-schema"
import { Icons } from "@/components/icons"

type Resource = components["schemas"]["Resource"]

export default function ResourcesPage() {
  const api = React.useContext(ApiContext)
  const [resources, setResources] = React.useState<Resource[]>([])
  const [resourceToDelete, setResourceToDelete] =
    React.useState<Resource | null>(null)

  React.useEffect(() => {
    if (!api.isLoaded) return
    api.instance.get<Resource[]>("/resources").then((res) => {
      setResources(res.data)
    })
  }, [api.isLoaded, api.instance, setResources])

  const columns: ColumnDef<Resource>[] = [
    {
      accessorKey: "Name",
      header: "Name",
    },
    {
      accessorKey: "Kind",
      header: "Kind",
    },
    {
      accessorKey: "Version",
      header: "Version",
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
                <Link href={`/resources/${resource.Spec.Key}`} legacyBehavior>
                  <a className="row flex w-full items-center">
                    <Icons.eye className="pr-2" />
                    Inspect
                  </a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setResourceToDelete(resource)
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

  function onConfirmChange() {
    setResourceToDelete(null)
  }

  async function onDeleteResource() {
    if (!resourceToDelete) return
    await api.instance.delete(`/resources/${resourceToDelete.Spec.ResourceKey}`)
    const res = await api.instance.get<Resource[]>("/resources")
    setResources(res.data)
  }

  return (
    <>
      <ModalConfirm
        open={resourceToDelete ? true : false}
        onOpenChange={onConfirmChange}
        onSubmit={onDeleteResource}
        title="Delete this resource ?"
        description="Deleting a resource will also delete all his history."
      />
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <h1 className="text-2xl font-extrabold leading-tight tracking-tighter">
          Resources
        </h1>
        <DataTable data={resources} columns={columns} />
      </section>
    </>
  )
}
