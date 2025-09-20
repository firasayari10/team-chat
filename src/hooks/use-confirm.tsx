import  {useState} from "react" ;
import {

    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DialogDescription } from "@radix-ui/react-dialog";

import { JSX } from "react/jsx-runtime";

export const useConfirm = (
    title:string,
    message:string,
):[()=> JSX.Element ,()=> Promise<unknown>] => {
    const [promise , setPromise ] = useState<{ resolve : (value : boolean)=> void}| null>(null);
    const confirm = () => new Promise((resolve, reject)=> {
        setPromise({resolve})
    })
    const handleClose = () => {
        setPromise(null);
    }
    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    }
     const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    }

    const ConfirmDialog =() => {
        return (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-2">
                    <Button 
                    onClick={handleCancel}
                    variant="outline">
                            Cancel
                    </Button>
                    <Button 
                    onClick={handleConfirm}
                    variant="outline">
                            Confirm
                    </Button>
                    

                </DialogFooter>
            </DialogContent>
        </Dialog>)
    }
    return [ConfirmDialog ,confirm]
}