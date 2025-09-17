"use client"
import {Toolbar} from "./toolbar"
interface WorkspaceIdLayoutProps {
    children : React.ReactNode;
}
const WorkspaceIdLayout = ( {children}:WorkspaceIdLayoutProps ) => {

    return (
        <div >
            <Toolbar />
            {children}
            
        </div>
    ) ;
}

export default WorkspaceIdLayout ;