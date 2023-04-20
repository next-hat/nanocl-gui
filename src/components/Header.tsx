import React from "react"
import Image from "next/image"
import Link from "next/link"

import { ApiContext, lastVersion } from "@/utils/api"

const Header = () => {
  const api = React.useContext(ApiContext)

  return (
    <header className="relative h-[60px] w-full flex-auto">
      <div className="absolute z-40 flex h-full w-full items-center bg-[var(--ifm-navbar-background-color)]  pb-[8px] pl-[16px] pr-[16px] pt-[8px] shadow-lg">
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
      </div>
    </header>
  )
}

export default Header
