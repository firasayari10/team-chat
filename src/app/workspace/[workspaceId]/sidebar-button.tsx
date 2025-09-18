import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import {Button } from "@/components/ui/button"
import {cn} from "@/lib/utils"

interface SidebarButtonProps {
    icon: LucideIcon | IconType ;
    label: string ;
    isAcive?:boolean ;
}


export const SidebarButton = ({icon: Icon, label ,isAcive}:SidebarButtonProps ) => {


    return (
        <div className="flex flex-col items-center justify-center gap-y-0.5 crusor-pointer group ">
            <Button variant="transparent"
            className={cn(
                "size-9 p-2 group-hover:bg-accent/20",
                isAcive && "bg-cacent/20"
            )}>
                <Icon className="size-5 text-white group-hover:scale-110 transition-all" />

            </Button>
            < span className="text-[11px] text-white group-hover:text-acent" >
            {label}
            </span>
        </div>
    )
}