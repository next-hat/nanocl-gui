import Link from "next/link"
import React from "react"

const Header = () => {
  return (
    <header className="relative h-16 flex-auto">
      <div className="fixed flex h-16 w-full items-center border-b-[1px] border-orange-600 bg-[var(--ifm-navbar-background-color)] p-4">
        <h1 className="text-xl">
          <Link href="/">Nanocl Dashboard</Link>
        </h1>
      </div>
    </header>
  )
}

export default Header
