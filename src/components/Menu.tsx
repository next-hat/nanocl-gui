import Link from "next/link"
import React from "react"

const items = [
  { Name: "Home", Href: "/" },
  // { Name: "Metrics", Href: "/metrics" },
  { Name: "Namespaces", Href: "/namespaces" },
  { Name: "Cargoes", Href: "/cargoes" },
  { Name: "Resources", Href: "/resources" },
  { Name: "State", Href: "/state" },
  { Name: "Settings", Href: "/settings" },
]

const Menu = () => {
  return (
    <div className="relative w-[242px]">
      <div className="fixed h-full w-[242px] flex-1 border-r border-r-white p-2">
        <ul>
          {items.map((item) => (
            <li
              className="w-full rounded p-2 transition hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)]"
              key={item.Name}
            >
              <Link className="h-full w-full" href={item.Href}>
                {item.Name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Menu
