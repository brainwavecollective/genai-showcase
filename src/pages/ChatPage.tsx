
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";

import { ProjectChatPageHeader } from "@/components/project-chat/ProjectChatPageHeader";
import { ProjectInfo } from "@/components/project-chat/ProjectInfo";
import { LimitReachedCard } from "@/components/project-chat/LimitReachedCard";
import { ChatContainer } from "@/components/project-chat/ChatContainer";
import { useProjectChatPage } from "@/hooks/useProjectChatPage";

const ChatPage = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const {
    project,
    messages,
    isLoading,
    isLoadingProject,
    limitReached,
    sendMessage
  } = useProjectChatPage(projectId);

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 pt-20 pb-16">
        <ProjectChatPageHeader projectId={projectId} />

        {isLoadingProject ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {project && <ProjectInfo project={project} />}

            {limitReached && <LimitReachedCard />}

            <ChatContainer
              messages={messages}
              isLoading={isLoading}
              limitReached={limitReached}
              user={user}
              onSendMessage={sendMessage}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default ChatPage;
