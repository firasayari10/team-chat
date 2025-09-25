"use client";
import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { WorkspaceSideBar } from "./workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const {parentMessageId , onClose}= usePanel();
  const showPanel = !!parentMessageId;
  return (
    <div>
      <Toolbar />

      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup direction="horizontal" autoSaveId="ca-workspace-layout">
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
            <WorkspaceSideBar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80} minSize={20}>
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
            <ResizableHandle  withHandle/>
            <ResizablePanel minSize={20} defaultSize={29} >
              Load Thread

            </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
