"use client"

import {
    Dialog,
    DialogContent,
    
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog" ;

import {useCreateWorkspaceModal} from "../store/use-create-workspace-modal"
import {useCreateWorkspace} from "../api/use-create-workspace"
import {Input} from"@/components/ui/input"
import {Button} from "@/components/ui/button"
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";


export const  CreateWorkspaceModal = () => {

    const [open , setOpen] = useCreateWorkspaceModal() ;
    const [name , setName] = useState("");
    const { mutate , isPending } = useCreateWorkspace() ;
    
    
    const handleClose = () => {
        setOpen(false);
    }
    
    
    
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name },
      {
        onSuccess(data: Id<"workspaces"> | null) {
          console.log(data);
        },
      }
    );
  }
    return (
        <Dialog open ={open} onOpenChange={handleClose}>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>
                            Add a workspace
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Input 

                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    disabled={isPending}
                    required
                    autoFocus
                    minLength={3}
                    placeholder="work space name "/>
                    <div className="flex justify-end">
                        <Button disabled={isPending}>
                            Create
                        </Button>

                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}