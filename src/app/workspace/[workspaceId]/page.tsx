
"use client"

import { useWorkspaceId } from "@/hooks/use-workspace-id"
import {useParams} from "next/navigation"
interface WorkspaceIdPageProps {
    params:{
        workspaceId:string,
    }
}



const WorkspaceIdPage = ( ) => {
    const workspaceId = useWorkspaceId();

    return (
        <div>
               worksapce id page 
        </div>
    )
}

export default WorkspaceIdPage ;