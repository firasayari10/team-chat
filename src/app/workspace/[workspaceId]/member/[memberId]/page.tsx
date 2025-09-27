"use client"
import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {Id} from "../../../../../../convex/_generated/dataModel"
import {toast} from "sonner"
import { Convergence } from "next/font/google";
import { Conversation } from "./conversation";
const MemberIdPage = () =>
{
    const memberId = useMemberId();
    const workspaceId = useWorkspaceId();

    const [conversationId, setConversationId] = useState<Id<"conversations">|null>(null);
    const {data, mutate , isPending} = useCreateOrGetConversation();
    useEffect(()=> {
        mutate({
            workspaceId ,
            memberId
        },{
            onSuccess(data){
                setConversationId(data);
            },
            onError()
            {
                toast.error("Failed to create or get covnersation ")
            }
        })

    },[memberId,workspaceId,mutate]);

    if (isPending)
    {
        return (
            <div className="h-full flex items-center justify-center ">
            <Loader className="size-6 animate-spin"/>

        </div>
        )
    }
    if (!conversationId)
    {
        return (
            <div className="h-full flex Fflex-col gap-y-2 items-center justify-center ">
            <AlertTriangle className="size-6 text-muted-foreground"/>
            <span className="text-sm text-muted-foreground">
                Conversation Not found 
            </span>

        </div>
        )
    }
    return ( 
     <Conversation id ={conversationId} />
        )
    
}

export default MemberIdPage ;