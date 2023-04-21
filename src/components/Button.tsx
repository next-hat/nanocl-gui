import React from "react"

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => any
  className?: string
  title?: string
  type?: "button" | "submit" | "reset" | undefined
}

const Button = (props: ButtonProps) => {
  return (
    <button
      type={props.type}
      title={props.title}
      onClick={props.onClick}
      className={`min-h-[28px] min-w-[100px] rounded px-4 py-1 text-xs font-bold text-white shadow-lg ${
        props.className || ""
      }`}
    >
      {props.children}
    </button>
  )
}

export default Button
