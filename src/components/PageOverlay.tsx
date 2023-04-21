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
        <div className="relative flex h-full w-full flex-row">
          <div className="relative mx-[auto] flex-1 flex-col p-[16px] pb-[32px]">
            {props.children}
          </div>
          <Menu className="max-lg:right-[-242px]" />
        </div>
      </div>
    </div>
  )
}

export default PageOverlay
