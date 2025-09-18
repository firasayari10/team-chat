"use client"

import { UserButton } from "@/features/auth/components/user-button"
import {SidebarButton} from "./sidebar-button"
import {WorspaceSwitcher} from "./workspace-switcher"
import {Bell, Home, MessagesSquare, MoreHorizontal} from "lucide-react"
import {usePathname} from "next/navigation"
export const Sidebar = () => {
    const pathname = usePathname() ;
    return (
        <aside className="w-[70px] h-screen bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
  <WorspaceSwitcher />
  <SidebarButton    icon={Home} label="Home" isAcive={pathname.includes("/workspace")} />
  <SidebarButton    icon={MessagesSquare} label="DMs"  />
  <SidebarButton    icon={Bell} label="Activity"  />
  <SidebarButton    icon={MoreHorizontal} label="more"  />
  <div className="flex flex-col items-center gap-y-1 mt-auto justify-center">
    <UserButton />
  </div>
</aside>

    )
}