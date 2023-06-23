import React from "react"
import { BarLoader } from "react-spinners"

export type ModalLoadingProps = {
  visible: boolean
}

export function ModalLoading(props: ModalLoadingProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black backdrop-blur-sm"
      style={{
        bottom: props.visible ? 0 : "-200%",
        transition: "0.5s ease",
        opacity: props.visible ? 1 : 0,
        zIndex: props.visible ? 100 : -1,
      }}
    >
      <div className="rounded p-2 shadow-lg">
        <BarLoader color="orange" width={100} height={10} />
      </div>
    </div>
  )
}
