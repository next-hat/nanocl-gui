import React from "react"

export type PageTitleProps = {
  children?: React.ReactNode
}

const PageTitle = (props: PageTitleProps) => {
  return (
    <div className="mb-4 mt-4 flex h-fit flex-row items-center border-b p-2 pb-8 text-xl font-bold">
      {props.children}
    </div>
  )
}

export default PageTitle
