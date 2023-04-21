import React from "react"
import Image from "next/image"
import Link from "next/link"

import { ApiContext, lastVersion } from "@/utils/api"
import { Bars4Icon } from "@heroicons/react/24/solid"
import Menu from "./Menu"

const Header = () => {
  const api = React.useContext(ApiContext)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  function changeMenuVisibility() {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="relative h-[60px] w-full flex-auto">
      <div
        data-tauri-drag-region
        className="fixed z-40 flex h-[60px] w-full items-center justify-between bg-[var(--ifm-navbar-background-color)] px-[16px] py-[8px] shadow-lg"
      >
        <div className="flex items-center p-2">
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
        <div className="hidden items-center justify-end p-2 max-lg:flex">
          <button
            className="h-6 w-fit max-w-fit p-0"
            onClick={changeMenuVisibility}
          >
            <Bars4Icon
              className="0.3 h-6 transition-all ease-in-out"
              style={{
                transform: isMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
              }}
            />
          </button>
        </div>
      </div>
      <div className="relative">
        <div
          className="fixed left-0 top-[60px] z-40 h-full w-full cursor-pointer bg-[rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out"
          style={{
            display: isMenuOpen ? "block" : "none",
            zIndex: isMenuOpen ? 40 : -1,
            opacity: isMenuOpen ? 1 : 0,
          }}
          onClick={changeMenuVisibility}
        />
        <Menu
          className="top-[60px] max-lg:right-[-242px]"
          style={{
            right: isMenuOpen ? "0px" : "-242px",
          }}
        />
      </div>
    </header>
  )
}

export default Header
