
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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
  
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
