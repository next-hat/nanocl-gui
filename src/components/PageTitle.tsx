import React from "react"

export type PageTitleProps = {
  children?: React.ReactNode
}

const PageTitle = (props: PageTitleProps) => {
  return (
    <div className="mb-4 mt-4 flex h-[60px] flex-row items-center border-b p-2 text-xl">
      {props.children}
    </div>
  )
}

export default PageTitle
