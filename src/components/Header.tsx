import React from "react"
import Image from "next/image"
import Link from "next/link"

import { ApiContext, lastVersion } from "@/utils/api"
// import Button from "./Button"
// import { Bars4Icon } from "@heroicons/react/24/solid"

const Header = () => {
  const api = React.useContext(ApiContext)

  return (
    <header className="relative h-[60px] w-full flex-auto">
      <div
        data-tauri-drag-region
        className="fixed z-40 flex h-[60px] w-full items-center bg-[var(--ifm-navbar-background-color)]  pb-[8px] pl-[16px] pr-[16px] pt-[8px] shadow-lg"
      >
        <Image
          className="mr-2"
          src="/logo.webp"
          alt="Logo"
          width={32}
          height={32}
        />
        <h1 className="text-[95%] font-bold">
          <Link href="/">
            {">_"} console
            {`${
              api.url
                ? `@${
                    api.url
                      .replace("http://", "")
                      .replace("https://", "")
                      .replace(`/${lastVersion}`, "") || ""
                  }`
                : ""
            }`}
          </Link>
        </h1>
        {/* <Button className="h-6 w-6">
          <Bars4Icon className="h-6 w-6" />
        </Button> */}
      </div>
    </header>
  )
}

export default Header
