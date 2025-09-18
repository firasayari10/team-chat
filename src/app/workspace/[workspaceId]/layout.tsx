"use client"
import {Toolbar} from "./toolbar"
import {Sidebar} from "./sidebar"
interface WorkspaceIdLayoutProps {
    children : React.ReactNode;
}
const WorkspaceIdLayout = ( {children}:WorkspaceIdLayoutProps ) => {

    return (
        <div >
            <Toolbar />

            <div className="flex h-[clac(100vh-40px)]">
                <Sidebar />
                {children}
            </div>
            
        </div>
    ) ;
}

export default WorkspaceIdLayout ;