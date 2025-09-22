
"use client"

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channelId";
import { Loader, TriangleAlert } from "lucide-react";
import { Header} from "./Header"

const ChannelIdPage = () =>  {
    const channelId = useChannelId();
    const {data:channel , isLoading:channelLoading} = useGetChannel({id: channelId})
    if(channelLoading)
    {
        return (
            <div className="h-full flex-1 flex items-center justify-center">
            <Loader className="animate-spin size-6 text-muted-foregroud" />
        </div>
        )
        
    }
    if(!channel)
    {
        return (
            <div className="h-full flex-1 flex flex-col  gap-y-2 items-center justify-center">
            <TriangleAlert className=" size-5 text-muted-foregroud" />
            <span  className="text-sm text-muted-foreground">
                Channel not found 
            </span>
        </div>
        )
        
    }
    return (
        <div className="flex flex-col h-ful">
            <Header title={channel.name} />

        </div>
        
    )
}


export default ChannelIdPage;