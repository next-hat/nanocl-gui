import React from "react"
import Button from "./Button"

export type PageTitleAction = {
  title: string
  onClick: () => void
  className?: string
  icon?: React.ReactNode
}

export type PageTitleProps = {
  title: string
  actions?: PageTitleAction[]
}

const PageTitle = (props: PageTitleProps) => {
  return (
    <div className="mb-[25px] flex h-fit flex-row items-center justify-between p-2 font-bold">
      <div className="flex h-fit flex-row items-center">
        <h1 className="h-fit text-[3rem]">{props.title}</h1>
      </div>
      <div className="flex flex-row items-center">
        {props.actions?.map((action, i) => (
          <Button
            key={i}
            title={action.title}
            className={`min-w-fit ${action.className}`}
            onClick={action.onClick}
          >
            {action.icon || action.title}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default PageTitle
