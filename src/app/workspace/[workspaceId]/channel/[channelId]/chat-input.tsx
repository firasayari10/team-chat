import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useChannelId } from "@/hooks/use-channelId";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic"
import {toast} from "sonner"
import Quill from "quill"
import {useRef, useState} from "react"
const Editor = dynamic(()=> import ("@/components/editor"),{ssr : false})
interface ChatInputProps {
    placeholder:string;
}
export const ChatInput =({placeholder}:ChatInputProps) => {
    const [editorKey , setEditorKey] = useState(0);
    const  [isPending , setIsPending]=useState(false);
    const editorRef = useRef<Quill | null>(null);
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const { mutate :createMessage} = useCreateMessage();


    const handleSubmit = async ({
        body , image

    }:{
        body:string;
        image: File |null;

    })=> {
        try {
            setIsPending(true)
            console.log({body,image});
         await createMessage( {
            workspaceId,
            channelId,
            body
        },{throwError : true });

        setEditorKey((prevkey) => prevkey + 1) ;
        } catch(error) { 
            toast.error("Failed to send Message ");
            

        }finally{
            setIsPending(false)

        }
        

    }
    return (
        <div className="px-5 w-full ">
    <Editor 
    key={editorKey}
    placeholder={placeholder}
    onSubmit={handleSubmit}
    disabled={false}
    innerRef={ editorRef}/>
</div>

    )
}