"use client"
import { format , isToday , isYesterday } from "date-fns";
import { Id , Doc } from "../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { Hint } from "./ui/hint";
import { Avatar , AvatarFallback , AvatarImage } from "./ui/avatar";
import { update } from "../../convex/channels";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./tool-bar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import {cn} from "@/lib/utils"
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useConfirm } from "@/hooks/use-confirm";
import { useToggleMessage } from "@/features/reactions/api/use-toggle-reaction";
import { Reactions } from "./reactions";
import { usePanel } from "@/hooks/use-panel";
import { ThreadBar } from "./thread-bar";
import { useEffect, useState } from "react";


const Renderer= dynamic(()=> import("@/components/renderer" ), { ssr : false});
const  Editor = dynamic(()=> import ("@/components/editor"),{ssr:false})

interface MessageProps{
    id: Id<"messages">;
    memberId:Id<"members">;
    authorImage?: string;
    authorName?: string;
    isAuthor : boolean;
    reactions : Array <Omit <Doc<"reactions">,"memberId"> & {
        count : number;
        memberIds: Id<"members">[];

    }>;
    body : Doc<"messages">["body"];
    image: string|undefined | null;
    createdAt : Doc <"messages">["_creationTime"];
    updatedAt?: Doc <"messages">["updatedAt"];
    isEditing:boolean;
    isCompact?:boolean;
    setEditingId: (id: Id<"messages"> | null ) => void ;
    hideThreadButton?:boolean;
    threadCount ?:number;
    threadImage?:string;
    threadName?:string;
    threadTimestamp?:number;
}

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date)?"Yesterday" : format(date,"MMM d, yyyy") } at ${format(date,"h:mm:ss a")}`;
}

export const Message = ({
    id,
    isAuthor,
    memberId,
    authorImage,
    authorName="Member",
    reactions,
    body,
    image,
    createdAt,
    updatedAt,
    isEditing,
    isCompact,
    setEditingId,
    hideThreadButton,
    threadCount,
    threadImage,
    threadName,
    threadTimestamp


}:MessageProps)=> {
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    const {parentMessageId,onOpenMessage , onOpenProfile,onClose} = usePanel();
    const { mutate: updateMessage , isPending: isUpdatingMesage} = useUpdateMessage();
    const {mutate: removeMessage , isPending : isRemovingMessage}=useRemoveMessage();
    const  {mutate : toggleReaction , isPending: isTogglingReaction}= useToggleMessage()

    const [ConfirmDialog , confirm] = useConfirm("Are you sure you want to delete this message ?" , "This action is irreversible")
    const isPending = isUpdatingMesage || isTogglingReaction;

    const handleReaction =( value: string)=> {
        toggleReaction({messageId: id , value},{
            onError:()=>{
                toast.error(" Failed to set reaction ")
            }
        });

    }

    const handleUpdate =({body}:{body:string})=> {
        updateMessage({id,body},
            {
                onSuccess:()=> {
                    toast.success("Message Updated");
                    setEditingId(null);
                },
                onError:()=> {
                    toast.error("Failed to update message ");
                }

            }
        )
       
    }
    const handleDelete = async()=> {
        const ok = await confirm();
        if(!ok) return;
        removeMessage({id}, {
            onSuccess:()=> {
                toast.success("Message Deleted Successfully")
                if(parentMessageId === id)
                {
                    onClose();
                }
            }
            ,
            onError:() => {
                toast.error("Error deleting Message ")

            }
        }) 
    }
    
    if (!isClient) {
    return (
        <div className="flex flex-col gap-2 p-1.5 px-5">
            <div className="flex items-start gap-2">
                {!isCompact && (
                    <Avatar className="mr-2">
                        <AvatarImage src={authorImage} />
                        <AvatarFallback className="bg-sky-500 text-white text-sm">
                            {authorName?.charAt(0).toUpperCase() || "M"}
                        </AvatarFallback>
                    </Avatar>
                )}
                <div className="flex flex-col w-full">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-20 bg-gray-100 rounded"></div>
                </div>
            </div>
        </div>
    );
}
    const createdAtDate = new Date(createdAt);

    if (isCompact) {
            return (
                <>
                <ConfirmDialog />

                <div
                className={cn(
                    "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/55 group relative",
                    isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                    isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
                )}
                >
                <div className="flex items-start gap-2">
                    <div className="w-[40px] text-center opacity-0 group-hover:opacity-100">
                    <Hint label={formatFullTime(createdAtDate)}>
                        <button className="text-xs text-muted-foreground leading-[22px] hover:underline">
                        {format(createdAtDate, "hh:mm")}
                        </button>
                    </Hint>
                    </div>

                    {isEditing ? (
                    <div className="w-full h-full">
                        <Editor
                        onSubmit={handleUpdate}
                        disabled={isPending}
                        defaultValue={JSON.parse(body)}
                        onCancel={() => setEditingId(null)}
                        variant="update"
                        />
                    </div>
                    ) : (
                    <div className="flex flex-col w-full overflow-hidden">
                        <Renderer value={body} />
                        <Thumbnail url={image} />
                        {updatedAt ?   (
                        <span className="text-xs text-muted-foreground">(edited)</span>
                        ):null}
                        <Reactions data={reactions} onChange={handleReaction} />
                        <ThreadBar 
                        count={threadCount}
                        image={threadImage}
                        name={threadName}
                        timestamp={threadTimestamp}
                        onClick={()=>onOpenMessage(id)}/>

                    </div>
                    )}
                </div>

                {!isEditing && (
                    <Toolbar
                    isAuthor={isAuthor}
                    isPending={false}
                    handleEdit={() => setEditingId(id)}
                    handleThread={() => onOpenMessage(id)}
                    handleDelete={handleDelete}
                    handleReaction={handleReaction}
                    hideThreadButton={hideThreadButton}
                    />
                )}
                </div>
                </>
            );
}


    const avatarFallBack = authorName.charAt(0).toUpperCase();
    return (
        <>
        <ConfirmDialog />
        <div className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/55 group relative" , 
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200")}>
            <div className="flex items-start gap-2">
                <button onClick={()=>onOpenProfile(memberId)} >
                    <Avatar className="mr-2">
                    <AvatarImage  src={authorImage} />
                        <AvatarFallback className=" bg-sky-500 text-white text-sm">
                            {avatarFallBack}
                        </AvatarFallback>
                </Avatar>
                </button>
                {isEditing ? ( 
                    <div className=" w-full h-full">
                        <Editor
                        onSubmit={handleUpdate}
                        disabled={isPending}
                        defaultValue={JSON.parse(body)} 
                        onCancel={()=>{setEditingId(null)}}
                        variant="update"/>
                    </div>
                ):
                    (
                        <div className="flex flex-col w-full overflow-hidden">
                    <div className="text-sm">
                        <button className="font-bold text-primary hover:underline" onClick={()=>onOpenProfile(memberId)}>
                            {authorName}

                        </button>
                        <span >
                            &nbsp;&nbsp;
                        </span>
                        <Hint label={formatFullTime(createdAtDate)} >
                        <button className="text-xs text-muted-foreground hover:underline">
                            {format(createdAtDate,"h:mm a")}

                        </button>
                        </Hint>
                        
                    </div>
                    <Renderer value={body} />
                    <Thumbnail url={image} />
                    {updatedAt ? (
                        <span className="text-xs text-muted-foreground" >
                                (edited)
                        </span>
                    ):null
                    }
                    <Reactions data={reactions} onChange={handleReaction} />
                    
                    <ThreadBar
                        count={threadCount}
                        image={threadImage}
                        timestamp={threadTimestamp}
                        name={threadName}
                        onClick={()=>onOpenMessage(id)}/>
                </div>
                    )
                }
                
            
            </div>
            {!isEditing && (
                <Toolbar
                isAuthor={isAuthor}
                isPending={isPending}
                handleEdit={()=>setEditingId(id)}
                handleThread={()=>onOpenMessage(id)}
                handleDelete={handleDelete}
                handleReaction={handleReaction}
                hideThreadButton={hideThreadButton}
                
                
                
                />
            )}
            
        </div>
        </>
)
}