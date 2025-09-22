import { Button } from "@/components/ui/button";
import  { FaChevronDown } from "react-icons/fa";
import {

    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/hooks/use-channelId";
import { toast } from "sonner";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useConfirm } from "@/hooks/use-confirm";

import {useRouter} from "next/navigation"
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

 interface HeaderProps {
    title: string ;
}


export const Header =({title}:HeaderProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const channelId= useChannelId();
    const [value , setValue] = useState(title);
    const [editOpen , setEditOpen] = useState(false);

    const {data: member}= useCurrentMember({workspaceId})

    const {mutate: updateChannel , isPending: IsupdatingChannel}= useUpdateChannel();
    const {mutate: removeChannel, isPending: IsRemovingChannel} = useRemoveChannel();
    const [ConfirmDialog , confim] = useConfirm("Are you sure you want to delete this Channel ?" , "This action is irreversible")

    const handleEditOpen= (value:boolean)=> {
        if (member?.role !== "admin") return ;
        setEditOpen(value)

    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g,"-").toLowerCase();
        setValue(value);
    }
    const  handleDelete= async() => {
        const ok = await confim();
        if(!ok) return ;

        removeChannel({id:channelId},{
            onSuccess:()=> {
                toast.success("Channel Deleted !")
                router.push(`/workspace/${workspaceId}`)
            },
            onError:()=> {
                toast.error(" Failed to delete Channel !")
            }
        })

    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault()

        updateChannel({id : channelId , name:value},{
            onSuccess: ()=> {
                toast.success(" Channel updated");
                setEditOpen(false);
            },
            onError : () => {
                toast.error(" error updating channel ")
            }
        })
    }
    return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden"> 
    <ConfirmDialog />
    <Dialog>
        <DialogTrigger asChild>

        
        <Button 
            variant="ghost"
            className="text-lg  font-semibold px-2 overflow-hidden w-auto"
            size="sm">
                <span className="truncate" >
                    # {title}

                </span>
                <FaChevronDown className="size-2.5 ml-2 " />

        </Button>
        </DialogTrigger>
        <DialogContent  className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white" >
                <DialogTitle>
                    # {title}
                </DialogTitle>

            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gapy-y-2">
                <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                    <DialogTrigger >
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className=" flex items-center justify-between">
                        <p className="text-sm font-semibold">
                            Channel Name :   # {title}

                        </p>
                        {member?.role === "admin" && <p className="text-sm text-[#126a3] hover:underline font-semibold">
                            Edit
                        </p> }
                        

                    </div>
                   

                </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Rename this Channel 
                        </DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4"  onSubmit={handleSubmit}>
                        <Input 
                        value={value}
                        disabled={IsupdatingChannel}
                        onChange={handleChange}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={80}
                        placeholder="example : plan-budget"/>

                        <DialogFooter>
                            <DialogClose  asChild>
                                <Button variant="outline" disabled={IsupdatingChannel}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button disabled={IsupdatingChannel}>
                                Save
                            </Button>

                        </DialogFooter>


                    </form>
                </DialogContent>
                </Dialog>
                
                <button  onClick = {handleDelete}className="flex item-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600" >
                    <TrashIcon  className="size-4"/>
                    {member?.role === "admin" && 
                    <p className="text-sm font-semibold">
                        Delete Channel 

                    </p> }
                </button>

            </div>

        </DialogContent>
    </Dialog>
    
        
    </div> )
    
}