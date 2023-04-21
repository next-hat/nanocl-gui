import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"

import { ApiContext } from "@/utils/api"

const items = [
  { Name: "Home", Href: "/", requireApi: true },
  { Name: "Namespaces", Href: "/namespaces", requireApi: true },
  { Name: "Cargoes", Href: "/cargoes", requireApi: true },
  { Name: "Resources", Href: "/resources", requireApi: true },
  { Name: "State", Href: "/state", requireApi: true },
  { Name: "Settings", Href: "/settings" },
]

const selectedStyle = {
  color: "var(--ifm-color-primary)",
  backgroundColor: "rgba(255,255,255,0.1)",
}

export type MenuProps = {
  className?: string
  style?: Record<string, string>
}

const Menu = (props: MenuProps) => {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  return (
    <div className="relative w-0 lg:w-[242px]">
      <div
        style={props.style}
        className={`fixed right-0 z-40 h-full w-[242px] bg-[var(--ifm-background-color)] shadow-lg transition-all duration-300 ease-in-out ${
          props.className || ""
        }`}
      >
        <ul>
          {items.map((item) => {
            const style: Record<string, string> =
              item.Href === "/"
                ? router.pathname === item.Href
                  ? { ...selectedStyle }
                  : {}
                : router.pathname.startsWith(item.Href)
                ? { ...selectedStyle }
                : {}
            const isDisabled = item.requireApi && !api.url
            if (isDisabled) {
              style.color = "red"
              style.backgroundColor = "rgba(255,0,0,0.1)"
              style.opacity = "0.5"
              style.cursor = "not-allowed"
            }
            return (
              <li
                style={style}
                className="m-2 flex rounded pb-[6px] pl-[12px] pr-[12px] pt-[6px] text-[95%] font-medium transition hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)]"
                key={item.Name}
              >
                {isDisabled ? (
                  <p className="h-full w-full">{item.Name}</p>
                ) : (
                  <Link className="h-full w-full" href={item.Href}>
                    {item.Name}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Menu
