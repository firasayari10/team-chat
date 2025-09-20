import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Id } from "../../../../convex/_generated/dataModel"
import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link" // Assuming you're using Next.js
import { useWorkspaceId } from "@/hooks/use-workspace-id"

interface UserItemProps {
    id: Id<"members">;
    label?: string;
    image?: string;
    variant?: VariantProps<typeof userItemVariants>["variant"];
}

const userItemVariants = cva(
    "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
    {
        variants: {
            variant: {
                default: "text-[#f9edffcc]",
                active: "text-[#481349] bg-white/90 hover:bg-white/90"
            },
        },
        defaultVariants: {
            variant: "default",
        }
    },
);

export const UserItem = ({ id, label = "member", image, variant }: UserItemProps) => {
    const workspaceId = useWorkspaceId();
    const avatarFallBack = label.charAt(0).toUpperCase();
    
    return (
        <Button 
            variant="transparent" 
            className={cn(userItemVariants({ variant }))}
            size="sm"
            asChild
        >
            <Link href={`/workspace/${workspaceId}/member/${id}`}>
                <Avatar className="size-5 rounded-md mr-1">
                    <AvatarImage className="rounded-md" src={image} />
                    <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs ">
                        {avatarFallBack}
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm truncate">
                    {label}
                </span>
            </Link>
        </Button>
    )
}