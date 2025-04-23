"use client"

import React from "react"
import { ApiContext } from "@/utils/api"
import { ModalConfirm } from "@/components/modal-confirm"

import type { components } from "@/types/api-schema"

import { TableCargoes } from "./table"

type CargoSummary = components["schemas"]["CargoSummary"]

export default function CargoesPage() {
  const api = React.useContext(ApiContext)
  const [cargoToDelete, setCargoToDelete] = React.useState<CargoSummary | null>(
    null
  )

  function onConfirmDelete(cargo: CargoSummary) {
    setCargoToDelete(cargo)
  }

  function onConfirmChange() {
    setCargoToDelete(null)
  }

  async function onDeleteCargo() {
    if (!cargoToDelete) return
    await api.instance.delete(`/cargoes/${cargoToDelete.Spec.CargoKey}?Force=true`)
  }

  return (
    <>
      <ModalConfirm
        open={cargoToDelete ? true : false}
        onOpenChange={onConfirmChange}
        onSubmit={onDeleteCargo}
        title="Delete this resource ?"
        description="Deleting a resource will also delete all his history."
      />
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <h1 className="text-2xl font-extrabold leading-tight tracking-tighter">
          Cargos
        </h1>
        <React.Suspense fallback={<div>Loading...</div>}>
          <TableCargoes onDelete={onConfirmDelete} />
        </React.Suspense>
      </section>
    </>
  )
}
