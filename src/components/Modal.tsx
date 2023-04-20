import React from "react"

type ModalProps = {
  children: React.ReactNode
  onClose: () => void
}

const Modal = (props: ModalProps) => {
  return (
    <div className="fixed z-50 flex h-full w-full items-center justify-center bg-black/50">
      <div className="fixed flex h-full w-full" onClick={props.onClose} />
      <div className="relative top-[-50px] min-w-[400px] max-w-[400px] rounded bg-[var(--ifm-modal-color-background)] p-4">
        {props.children}
      </div>
    </div>
  )
}

export default Modal
