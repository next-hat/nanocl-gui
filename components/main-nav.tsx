"use client"

import React from "react"
// import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

interface MainNavProps {
  items?: NavItem[]
}

const selectedStyle = {
  color: "hsl(var(--foreground-secondary))",
  opacity: 1,
}

const unselectedStyle = undefined

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        {/* <Image src="/logo.png" width={42} height={42} alt="logo" /> */}
        <span className="hidden font-bold text-white sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-semibold text-muted-foreground sm:text-sm",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                  style={
                    item.href === "/" && pathname === item.href
                      ? selectedStyle
                      : item.href !== "/" && pathname.includes(item.href)
                      ? selectedStyle
                      : unselectedStyle
                  }
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
