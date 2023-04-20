import React from "react"
import { BarLoader } from "react-spinners"

export type ModalLoadingProps = {
  visible: boolean
}

const ModalLoading = (props: ModalLoadingProps) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[var(--ifm-modal-color-background)] shadow-lg"
      style={{
        bottom: props.visible ? 0 : "-200%",
        transition: "0.5s ease",
        opacity: props.visible ? 1 : 0,
        zIndex: props.visible ? 50 : -1,
      }}
    >
      <div className="rounded border border-black p-2 shadow-lg">
        <BarLoader color="orange" width={100} height={10} />
      </div>
    </div>
  )
}

export default ModalLoading
