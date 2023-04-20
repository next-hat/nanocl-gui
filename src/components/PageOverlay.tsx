import React from "react"

import Menu from "@/components/Menu"
import Header from "./Header"

type TPageOverlayProps = {
  children: React.ReactNode
}

const PageOverlay = (props: TPageOverlayProps) => {
  return (
    <div className="h-full w-full">
      <Header />
      <div className="relative h-[calc(100%-64px)] w-full">
        <div className="relative h-full w-full flex-row">
          <Menu />
          <div className="ml-[242px] p-2">{props.children}</div>
        </div>
      </div>
    </div>
  )
}

export default PageOverlay
