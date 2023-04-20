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
          <div className="relative mx-[auto] max-w-[1320px] p-[16px] pb-[32px]">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageOverlay
