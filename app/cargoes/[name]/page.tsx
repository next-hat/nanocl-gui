"use client"

import React from "react"
import { ApiContext } from "@/utils/api"
import { ModalConfirm } from "@/components/modal-confirm"

import type { components } from "@/types/api-schema"

import { InfoCargo } from "./info"

type CargoInspect = components["schemas"]["CargoInspect"]

export default function CargoPage() {
  const api = React.useContext(ApiContext)
  const [cargoToDelete, setCargoToDelete] = React.useState<CargoInspect | null>(
    null
  )

  function onConfirmChange() {
    setCargoToDelete(null)
  }

  return (
    <>
      <ModalConfirm
        open={cargoToDelete ? true : false}
        onOpenChange={onConfirmChange}
        onSubmit={async () => {}}
        title="Delete this resource ?"
        description="Deleting a resource will also delete all his history."
      />
      <React.Suspense fallback={<div>Loading...</div>}>
        <InfoCargo onDelete={() => {}} />
      </React.Suspense>
    </>
  )
}
