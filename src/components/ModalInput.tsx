import React from "react"

import Modal from "./Modal"
import Button from "./Button"
import { CircleLoader } from "react-spinners"

export type ModalInputProps = {
  title: string
  label: string
  placeholder?: string
  onClose: () => void
  onConfirm: (value: string) => Promise<any>
}

const ModalInput = (props: ModalInputProps) => {
  const inputRef = React.createRef<HTMLInputElement>()

  const [value, setValue] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [inputRef])

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function onConfirm() {
    setIsLoading(true)
    props
      .onConfirm(value)
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
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h3 className="text-xl">{props.title}</h3>
        </div>
        <div className="mt-4 flex flex-col">
          <label className="text-[var(--ifm-color-emphasis-500)]]">
            {props.label}
          </label>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={props.placeholder}
            className="mb-4 mt-2 rounded border border-white bg-transparent p-2 focus:border-[var(--ifm-color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ifm-color-primary)]"
          />
        </div>
        {error && (
          <p className="mb-4 max-w-full break-all text-center text-sm font-bold text-red-500">
            {error}
          </p>
        )}
        {!isLoading ? (
          <div className="flex w-full justify-between">
            <Button
              className="mr-2 mt-2 h-[42px] w-full bg-red-500 hover:bg-red-700"
              onClick={onConfirm}
            >
              Confirm
            </Button>
            <Button
              className="ml-2 mt-2 h-[42px] w-full bg-gray-500 hover:bg-gray-700"
              onClick={props.onClose}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4">
            <CircleLoader color="orange" size={40} />
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalInput
