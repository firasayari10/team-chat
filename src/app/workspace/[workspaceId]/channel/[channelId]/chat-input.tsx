import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useChannelId } from "@/hooks/use-channelId";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic"
import {toast} from "sonner"
import Quill from "quill"
import {useRef, useState} from "react"
import { useUploadGenerateUrl } from "@/features/upload/api/use-generate-upload";

import {Id} from "../../../../../../convex/_generated/dataModel"
const Editor = dynamic(()=> import ("@/components/editor"),{ssr : false})


interface ChatInputProps {
    placeholder:string;
}

type CreateMessageValues = {
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
    body:string;
    image: Id<"_storage"> | undefined ;
}
export const ChatInput =({placeholder}:ChatInputProps) => {
    const [editorKey , setEditorKey] = useState(0);
    const  [isPending , setIsPending]=useState(false);
    const editorRef = useRef<Quill | null>(null);
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const { mutate: generateUploadUrl} = useUploadGenerateUrl();
    
    const { mutate :createMessage} = useCreateMessage();


    const handleSubmit = async ({
        body , image

    }:{
        body:string;
        image: File |null;

    })=> {
        try {
            setIsPending(true);
            editorRef?.current?.enable(false);
            const values : CreateMessageValues = {
                channelId,
                workspaceId,
                body,
                image:undefined ,

            };
            if(image)
            {
                const url = await generateUploadUrl({}, { throwError: true});
                if(!url ) 
                {
                    throw new Error ("URL not found") ;
                }
                const result = await fetch (url,
                    {
                        method:"POST",
                        headers: {"Content-Type": image.type},
                        body:image,
                    }
                );
                if (!result.ok)
                {
                    throw new Error ( "Failed to upload Image ") ;
                }
                const {storageId} = await result.json();
                values.image = storageId;
            }
            console.log({body,image});
         await createMessage( values ,
        {throwError : true });

        setEditorKey((prevkey) => prevkey + 1) ;
        } catch(error) { 
            toast.error("Failed to send Message ");
            

        }finally{
            setIsPending(false)
            editorRef?.current?.enable(true);


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