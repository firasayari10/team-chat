import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface ThreadBarProps {
  count?: number;
  
  image?: string;
  timestamp?: number;
  onClick?: () => void;
  name?: string;
}

export const ThreadBar = ({ 
  count, 
   
  image, 
  name = "member",
  timestamp, 
  onClick 
}: ThreadBarProps) => {
  
  const avatarFallBack = name.charAt(0).toUpperCase();

  

  if (!count || timestamp == null) {
    return null;
  }

  return (
    <div>
      <button
        onClick={onClick}
        className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px]"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Avatar className="size-6 shrink-0">
            <AvatarImage src={image} />
            <AvatarFallback>{avatarFallBack}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-sky-700 hover:underline font-bold truncate">
            {count} {count > 1 ? "replies" : "reply"}
          </span>
          <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
            Last Reply { formatDistanceToNow(timestamp, { addSuffix: true }) }
          </span>
          <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
            View Thread
          </span>
        </div>
        <ChevronDown className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
      </button>
    </div>
  );
};