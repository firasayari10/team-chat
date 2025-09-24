import { format , isToday , isYesterday } from "date-fns";
import { Id , Doc } from "../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { Hint } from "./ui/hint";
import { Avatar , AvatarFallback , AvatarImage } from "./ui/avatar";
import { update } from "../../convex/channels";
import { Thumbnail } from "./thumbnail";



const Renderer= dynamic(()=> import("@/components/renderer" ), { ssr : false})

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
    updatedAt: Doc <"messages">["updatedAt"];
    isEditing:boolean;
    isCompact?:boolean;
    setEditingId: (id: Id<"messages"> | null ) => void ;
    hideThreadButton?:boolean;
    threadCount ?:number;
    threadImage?:string;
    threadTimestamp?:number;
}
const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date)?"yesterday" : format(date,"MMM d ,yyyy") } at ${format(date,"h:mm:ss a")}`;
}

export const Message = ({
    id,
    isAuthor,
    memberId,
    authorImage,
    authorName="member",
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
    threadTimestamp


}:MessageProps)=> {
    if(isCompact) {
    return ( 
        <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/55 group relative">
            <div className="flex items-start gap-2">
                <div className="opacity-0 group-hover:opacity-100">
                    <Hint label={formatFullTime(new Date(createdAt))}>
                        <button className="text-xs text-muted-foreground leading-[22px] w-[40px] text-center hover:underline">
                            {format(new Date(createdAt), "hh:mm")}
                        </button>
                    </Hint>
                </div>

                    <div className="flex flex-col w-full">
                        <Renderer value={body} />
                        <Thumbnail url={image} />
                                {updatedAt ? (
                                    <span className="text-xs text-muted-foreground">(edited)</span>
                                ) : null}
                    </div>
            </div>
    </div>

    )
    }
    const avatarFallBack = authorName.charAt(0).toUpperCase();
    return (
        <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/55 group relative">
            <div className="flex items-start gap-2">
                <button >
                    <Avatar className="mr-2">
                    <AvatarImage  src={authorImage} />
                        <AvatarFallback className=" bg-sky-500 text-white text-sm">
                            {avatarFallBack}
                        </AvatarFallback>
                </Avatar>
                </button>
                <div className="flex flex-col w-full overflow-hidden">
                    <div className="text-sm">
                        <button className="font-bold text-primary hover:underline" onClick={()=>{}}>
                            {authorName}

                        </button>
                        <span >
                            &nbsp;&nbsp;
                        </span>
                        <Hint label={formatFullTime(new Date(createdAt))} >
                        <button className="text-xs text-muted-foreground hover:underline">
                            {format(new Date(createdAt),"h:mm a")}

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
                </div>
            
            </div>
            
        </div>
)
}


