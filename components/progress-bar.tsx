import React from "react"

export type ProgressBarProps = {
  Progress: number
  className?: string
  children?: React.ReactNode
}

export function ProgressBar(props: ProgressBarProps) {
  return (
    <div className="relative flex h-4 w-full flex-row rounded-full bg-gray-200 dark:bg-gray-700">
      <div className="absolute flex h-4 w-full items-center justify-center">
        {props.children}
      </div>
      <div
        style={{
          width: `${props.Progress}%`,
        }}
        className={`flex h-4 rounded-full bg-blue-600 ${props.className || ""}`}
      ></div>
    </div>
  )
}
