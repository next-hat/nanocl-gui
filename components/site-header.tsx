import Link from "next/link"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="bg-background-primary sticky top-0 z-40 w-full shadow-lg">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="size-8 p-0">
            <Link href="/state">
              <Icons.rocket color="hsl(var(--muted-foreground))" />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <Icons.cog color="hsl(var(--muted-foreground))" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="relative w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex-col items-start">
                  <Link href="settings" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="flex justify-center">
                <ThemeToggle />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
