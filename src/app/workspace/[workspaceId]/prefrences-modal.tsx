import {

    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace ";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-delete-workspace";
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {toast} from "sonner"
import { TrashIcon } from "lucide-react";
import  {useState} from "react" ;
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation"


interface PreferencesModalProps {
    open : boolean ;
    setOpen : (open:boolean)=> void;
    initialValue : string ;
}


export const PreferencesModal =({
    open ,
    setOpen,
    initialValue
}: PreferencesModalProps) => {
    const router = useRouter()
    const workspaceId = useWorkspaceId() ;
    const [value , setValue] = useState(initialValue);
    const [editOpen , setEditOpen] = useState(false);
    const {mutate: updateworkspace , isPending: isUpdatingWorkspace} = useUpdateWorkspace();
    const {mutate: removeworkspace , isPending: isRemovingWorkspace} = useRemoveWorkspace();
    const handleRemove = ()=> {
        removeworkspace({
            id:workspaceId
        },{
            onSuccess:() => {
                router.replace("/")
                toast.success("workspace deleted")
                setEditOpen(false);
            },
            onError :() => {
                toast.error("Failed to delete workspace ")
            }
        }, 
    )
    }
    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateworkspace({
            id: workspaceId ,
            name: value,

        }, {
            onSuccess:() => {
                toast.success("workspace updated")
                setEditOpen(false);
            },
            onError :() => {
                toast.error("Failed to update workspace ")
            }
        })
    }
    
    return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
                <DialogTitle>
                    {value}
                </DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">
                            Workspace name
                        </p>
                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                            Edit
                        </p>
                 </div>
                 <p className="text-sm">
                    {value}

                 </p>
                </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Rename this Workspace
                        </DialogTitle>
                    </DialogHeader>
                    <form  className="space-y-4"
                    onSubmit={handleEdit}
                    >
                        <Input
                        value={value}
                        disabled={isUpdatingWorkspace}
                        onChange={(e)=>setValue(e.target.value)}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={80}
                        placeholder="new work space name : "
                         />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" disabled={isUpdatingWorkspace} >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button  disabled={isUpdatingWorkspace} >
                                Save
                            </Button>
                        </DialogFooter>


                    </form>

                    
                </DialogContent>
                </Dialog>
                <button 
                disabled={isRemovingWorkspace}
                onClick={handleRemove}
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600">
                <TrashIcon  className="size-4"/>
                <p className="text-sm font-semibold ">
                    delete workspace
                </p>
                </button>
            </div>
        </DialogContent>
    </Dialog>
        
    )
}