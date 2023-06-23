"use client"

import React from "react"
import { ApiContext } from "@/utils/api"
import { ModalConfirm } from "nanocl-gui-toolkit/components/modal-confirm"
import { Button } from "nanocl-gui-toolkit/components/ui/button"

import type { components } from "@/types/api-schema"
import { DialogNewNamespace } from "@/components/dialog-new-namespace"
import { Icons } from "@/components/icons"

import { TableNamespaces } from "./table"

type NamespaceSummary = components["schemas"]["NamespaceSummary"]
type NamespacePartial = components["schemas"]["NamespacePartial"]

type DialogNewNamespace = {
  open: boolean
  onOpenChange: () => void
  onSubmit: (data: NamespacePartial) => Promise<any>
}

export default function NamespacesPage() {
  const api = React.useContext(ApiContext)
  const [newOpen, setNewOpen] = React.useState(false)
  const [namespaceToDelete, setNamespaceToDelete] =
    React.useState<NamespaceSummary | null>(null)

  async function onNewNamespace(data: NamespacePartial) {
    await api.instance.post("/namespaces", data)
    onOpenChange()
  }

  function onOpenChange() {
    setNewOpen(!newOpen)
  }

  function onConfirmChange() {
    setNamespaceToDelete(null)
  }

  function onConfirmDelete(namespace: NamespaceSummary) {
    setNamespaceToDelete(namespace)
  }

  async function onDeleteNamespace() {
    if (!namespaceToDelete) return
    await api.instance.delete(`/namespaces/${namespaceToDelete.Name}`)
    return namespaceToDelete
  }

  return (
    <>
      <DialogNewNamespace
        open={newOpen}
        onSubmit={onNewNamespace}
        onOpenChange={onOpenChange}
      />
      <ModalConfirm
        open={namespaceToDelete ? true : false}
        onOpenChange={onConfirmChange}
        onSubmit={onDeleteNamespace}
        title="Delete this namespace ?"
        description="Deleting a namespace will delete all its cargoes and instances."
      />
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="row flex items-center justify-between">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter">
            Namespaces
          </h1>
          <Button title="New" onClick={onOpenChange} className="h-6 w-6 p-0">
            <Icons.plus className="h-4 w-4" />
          </Button>
        </div>
        <React.Suspense fallback={<div>Loading...</div>}>
          <TableNamespaces onDelete={onConfirmDelete} />
        </React.Suspense>
      </section>
    </>
  )
}
