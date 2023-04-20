import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

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

const Menu = () => {
  const router = useRouter()
  const api = React.useContext(ApiContext)

  return (
    <div className="relative w-[242px]">
      <div className="fixed h-full w-[242px] flex-1">
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
                className="m-2 flex rounded p-2 transition hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)]"
                key={item.Name}
              >
                {isDisabled ? (
                  <p>{item.Name}</p>
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
