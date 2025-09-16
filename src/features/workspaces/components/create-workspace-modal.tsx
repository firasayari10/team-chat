"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog" ;

import {useCreateWorkspaceModal} from "../store/use-create-workspace-modal"

import {Input} from"@/components/ui/input"
import {Button} from "@/components/ui/button"


export const  CreateWorkspaceModal = () => {
    const [open , setOpen] = useCreateWorkspaceModal() ;
    const handleClose = () => {
        setOpen(false);
    }
    return (
        <Dialog open ={open} onOpenChange={handleClose}>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>
                            Add a workspace
                    </DialogTitle>
                </DialogHeader>
                <form >
                    <Input 

                    value=""
                    disabled={false}
                    required
                    autoFocus
                    minLength={3}
                    placeholder="work space name "/>
                    <div className="flex justify-end">
                        <Button disabled={false}>
                            Create
                        </Button>

                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}