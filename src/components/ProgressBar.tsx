import React from "react"

export type ProgressBarProps = {
  Progress: number
  className?: string
  children?: React.ReactNode
}

const ProgressBar = (props: ProgressBarProps) => {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (ref.current) {
      console.log("set progress")
      ref.current.style.width = `${props.Progress}%`
    }
  }, [props.Progress])

  return (
    <div className="relative flex h-4 w-full flex-row rounded-full bg-gray-200 dark:bg-gray-700">
      <div className="absolute flex h-4 w-full items-center justify-center">
        {props.children}
      </div>
      <div
        ref={ref}
        className={`flex h-4 rounded-full bg-blue-600 ${props.className || ""}`}
      ></div>
    </div>
  )
}

export default ProgressBar
