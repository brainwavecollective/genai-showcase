
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Project, User } from "@/types";
import { ArrowLeft, Bot, Loader2 } from "lucide-react";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

const ChatPage = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your project assistant. Ask me anything about this project or what you'd like to know.",
        isUser: false,
      },
    ]);
  }, []);

  // Fetch project data
  useEffect(() => {
    if (!projectId) return;
    
    const fetchProject = async () => {
      setIsLoadingProject(true);
      try {
        const { data, error } = await supabase
          .from("project_details")
          .select("*")
          .eq("id", projectId)
          .single();

        if (error) throw error;
        setProject(data as unknown as Project);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProject(false);
      }
    };

    fetchProject();
  }, [projectId, toast]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Add loading message
    const loadingId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        content: "",
        isUser: false,
      },
    ]);
    setIsLoading(true);

    try {
      // Create project context for the AI
      const projectContext = project
        ? `
          Project Title: ${project.title}
          Description: ${project.description || "No description provided"}
          Created by: ${project.creator_name || "Unknown creator"}
          Tags: ${project.tag_names?.join(", ") || "No tags"}
        `
        : "No project information available";

      // Send to OpenAI via edge function
      const response = await supabase.functions.invoke("project-chat", {
        body: { message: content, projectContext },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Replace loading message with AI response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                content: response.data.response,
              }
            : msg
        )
      );
    } catch (error) {
      console.error("Chat error:", error);
      // Replace loading message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                content: "Sorry, I encountered an error. Please try again.",
              }
            : msg
        )
      );
      toast({
        title: "Error",
        description: "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(`/project/${projectId}`)}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Back to Project
            </Button>
            <div className="flex items-center gap-2 text-primary">
              <Bot size={20} />
              <h1 className="text-xl font-semibold">Project Assistant</h1>
            </div>
          </div>

          {isLoadingProject ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {project && (
                <Card className="mb-6 p-4 bg-muted/30">
                  <h2 className="font-semibold text-lg">{project.title}</h2>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.description.length > 150
                        ? `${project.description.substring(0, 150)}...`
                        : project.description}
                    </p>
                  )}
                </Card>
              )}

              <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      content={message.content}
                      isUser={message.isUser}
                      user={message.isUser ? user : undefined}
                      isLoading={isLoading && messages[messages.length - 1].id === message.id && !message.isUser}
                    />
                  ))}
                </div>
                <ChatInput onSend={sendMessage} isLoading={isLoading} />
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
