
import {Button} from "@/components/ui/button"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import {Search, Info, } from "lucide-react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  
} from "@/components/ui/command"
import { useState } from "react";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";

import { useRouter } from "next/navigation";

export const Toolbar = () => {
    const workspaceId = useWorkspaceId() ;
    const { data } = useGetWorkspace({id:workspaceId})
    const {data:channels} = useGetChannels({workspaceId});
    const {data:members} = useGetMembers({workspaceId});
    const router = useRouter();
    const [open,setOpen] = useState(false);

    const onChannelClick =(channelId: string) => {
        setOpen(false);
        router.push(`/workspace/${workspaceId}/channel/${channelId}`)

    }
    const onMemberClick =(MemberId: string) => {
        setOpen(false);
        router.push(`/workspace/${workspaceId}/member/${MemberId}`)

    }
    return(
        <nav className="bg-[#481349] flex items-center justify-between p-1.5 h-10">
            <div  className="flex-1"/>
            <div className=" min-w-[250px] max-[642px] grow-[2] shrink" >
                <Button onClick={()=>setOpen(true)} size="sm" className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2">
                    <Search className="size-4 text-white mr-2" />
                    <span className="text-white text-xs" >
                        Search your workspaces : eg {data?.name}  etc
                    </span>
                </Button>
                                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Channels">
                        {channels?.map((channel)=> (
                            <CommandItem  onSelect={()=>onChannelClick(channel._id)}>
                                
                                    {channel.name}
                                
                                
                            </CommandItem>
                        ))}
                       
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Members">
                        {members?.map((Member)=> (
                            <CommandItem  onSelect={()=>onMemberClick(Member._id)}> 
                               
                                {Member.user.name}
                              
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    </CommandList>
                </CommandDialog>

            </div>
            <div className="ml-auto flex-1 flex  items-center justify-end" >
                <Button variant="transparent" size="iconSm">
                    <Info className="size-5 text-white">

                    </Info>
                </Button>
            </div>
        </nav>
    )
}