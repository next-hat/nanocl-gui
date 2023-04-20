import React from "react"

import Modal from "./Modal"
import Button from "./Button"
import { CircleLoader } from "react-spinners"

type ModalConfirmProps = {
  title: string
  onClose: () => void
  onConfirm: () => Promise<any>
  onCancel: () => void
}

const ModalConfirm = (props: ModalConfirmProps) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  function handleConfirm() {
    setIsLoading(true)
    props
      .onConfirm()
      .then(() => {
        setIsLoading(false)
        props.onClose()
      })
      .catch((err) => {
        setError(err.message)
        setIsLoading(false)
      })
  }

  return (
    <Modal onClose={props.onClose}>
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-2xl font-bold">Confirm</h3>
        <p className="mb-4 text-sm text-gray-500">{props.title}</p>
        {error && (
          <p className="mb-4 max-w-full break-all text-center text-sm font-bold text-red-500">
            {error}
          </p>
        )}
        {!isLoading ? (
          <div className="flex w-full justify-between">
            <Button
              className="mr-2 h-[42px] w-full bg-red-500 hover:bg-red-700"
              onClick={handleConfirm}
            >
              Yes
            </Button>
            <Button
              className="h-[42px] w-full rounded bg-gray-500 hover:bg-gray-700"
              onClick={props.onCancel}
            >
              No
            </Button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center">
            <CircleLoader color="orange" size={40} />
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalConfirm
