import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {useState} from "react"
import {useCreateChannelModal} from "../store/use-create-channel-modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateChannel } from "../api/use-create-channel"
import { useWorkspaceId } from "@/hooks/use-workspace-id"

export const CreactChannelModal = ()=> {
    const workspaceId = useWorkspaceId();
    const [open ,setopen] = useCreateChannelModal()
    const {mutate, isPending} = useCreateChannel() ;
    const [name , setName] = useState("")
    const handleClose = () => {
        setName("");
        setopen(false)
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g,"-").toLowerCase();
        setName(value);
    }

    const handleSubmit =(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate (
            { name , workspaceId},
            {
                onSuccess :(id)=> {
                    handleClose()
                }
            }
        )

    }
    return ( 
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add a channel 
                    </DialogTitle>

                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input 
                    value={name}
                    disabled={isPending}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder=" insert channel name "/>
                    <div className="flex justify-end">
                        <Button disabled={false} >
                            Create 
                        </Button>

                    </div>

                </form>
            </DialogContent>

        </Dialog>
    )
}