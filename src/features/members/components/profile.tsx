import { Button } from "@/components/ui/button";
import {Id}from "../../../../convex/_generated/dataModel"
import { useGetMember } from "../api/use-get-member";
import { AlertTriangle, ChevronDown, ChevronDownIcon, Loader, MailIcon, XIcon } from "lucide-react";
import {Avatar,AvatarFallback,AvatarImage} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {toast} from "sonner"
import { update } from "../../../../convex/channels";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
interface ProfileProps {
    memberId:Id<"members">;
    onClose:()=>void;
}
export const Profile=({
    memberId,
    onClose,
}:ProfileProps)=> {
  const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [LeaveDialog, ConfirmLeaveDialog]= useConfirm("Leave worksapce" , "Once you leave , somebody needs to invite back in !");
    const [RemoveDialog, ConfirmRemovedialog]= useConfirm("Remove member" , "Are you sure you want to remove this member ?");
    const [UpdateDialog, ConfirmUpdateDialog]= useConfirm("Change Role " , "Are you sure you want to remove this member's role ?");
    const {data: currentMember , isLoading:isLoadingCurrentMember} = useCurrentMember({workspaceId});
    const {data:member , isLoading:isLoadingMember} = useGetMember({id:memberId});
    const {mutate: updateMember , isPending:isUpdatingMember} = useUpdateMember();
    const { mutate:removeMember , isPending:isRemovingMember}=useRemoveMember();
    
    const onRemove = async() => {
      const ok = await ConfirmRemovedialog();
      if(!ok)return;
      removeMember({id:memberId},{
  
        onSuccess:()=> {
          toast.success("Member removed");
          onClose()
        },
        onError:()=>
        {
          toast.error("Error Removing Member")
        }
      })
    };
    const onLeave = async() => {
      
      const ok=await ConfirmRemovedialog();
      if(!ok)return;
      removeMember({id:memberId},{
        onSuccess:()=> {
          router.replace("/")
          toast.success(" you left the workspace");
          onClose()
        },
        onError:()=>
        {
          toast.error("Failed to leave the workspace")
        }
      })
    };
     const onUpdate = async (role :"admin" |"member") => {
      const ok=await ConfirmUpdateDialog();
      if(!ok)return;
      updateMember({id:memberId , role},{
        onSuccess:()=> {
          toast.success("Role Changed");
          onClose()
        },
        onError:()=>
        {
          toast.error("Failed to change role")
        }
      })
    };
    
   

    
  if ( isLoadingMember || isLoadingCurrentMember ) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <Loader className="size-5 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading Profile </p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile  not found</p>
        </div>
      </div>
    );
  }
  const avatarFallback = member.user.name?.[0] ?? "M"
    return (
      <>
      <RemoveDialog />
      
      <LeaveDialog />
      <UpdateDialog />

      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
    <Avatar className="w-[256px] h-[256px] flex-shrink-0">
        <AvatarImage src={member.user.image} />
        <AvatarFallback className="aspect-square text-6xl">
            {avatarFallback}
        </AvatarFallback>
    </Avatar>
    
</div>
        <div className="flex flex-col p-4">
            <p className="text-xl font-bold">
                UserName : {member.user.name}
            </p>
            {currentMember?.role === "admin" && currentMember?._id !== memberId ? (
                
                <div className="flex items-center gap-2 mt-4">
                  <Button className="w-full capitalize " variant="outline">
                  {member.role} <ChevronDownIcon className="size-4 ml-2" />
                </Button>
                <Button variant="outline" className="w-full" onClick={onRemove}>
                  Remove
                </Button>
                </div>

            ): currentMember?._id === memberId && currentMember?.role !== "admin" ? (
              <div className="mt-4">
                  <Button className="w-full" variant="outline" onClick={onLeave}>
                    Leave
                  </Button>
              </div>
            ): null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
                <p className="text-sm font-bold mb-4">
                    Contact Information : 
                </p>
                <div className="flex items-start gap-3">
                    <div className="size-9 rounded-md bg-muted flex items-center justify-center">
                        <MailIcon className="size-6" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[13px] font-semibold text-muted-foreground">
                            Email Address
                        </p>
                        <Link
                            href={`mailto:${member.user.email}`} 
                            className="text-sm hover:underline text-[#1264a3]">
                                {member.user.email}
                        </Link>
        </div>
    </div>
</div>
      </div>
      </>
    )
}