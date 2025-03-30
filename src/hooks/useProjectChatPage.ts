
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types';

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

// Maximum number of retries for overloaded API
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000; // 2 seconds

export function useProjectChatPage(projectId: string | undefined) {
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your project assistant. Ask me anything about this project or the ATLAS Institute Generative AI Showcase.",
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

  // Helper to sleep for ms milliseconds
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const sendMessage = async (content: string, isRetry = false) => {
    if (!content.trim() || (isLoading && !isRetry) || limitReached) return;

    // For new messages (not retries), add user message and reset retry state
    if (!isRetry) {
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        content,
        isUser: true,
      };
      setMessages((prev) => [...prev, userMessage]);
      setRetryCount(0);
      setRetryMessage(null);
    }

    // Add loading message or update existing one for retries
    const loadingId = isRetry 
      ? messages[messages.length - 1].id 
      : (Date.now() + 1).toString();
    
    if (!isRetry) {
      setMessages((prev) => [
        ...prev,
        {
          id: loadingId,
          content: "",
          isUser: false,
        },
      ]);
    }
    
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

      // Send to Anthropic API via edge function
      const response = await supabase.functions.invoke("project-chat", {
        body: { message: content, projectContext },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Handle server-side retry flag
      if (response.data.retry === true) {
        // Store the message for retrying
        setRetryMessage(content);
        throw new Error('Service overloaded, will retry automatically');
      }

      // Check if we've hit the daily limit
      if (response.data.response.includes("number of available free chats for today has been exhausted")) {
        setLimitReached(true);
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
      
      // Reset retry state on success
      setRetryCount(0);
      setRetryMessage(null);
    } catch (error) {
      console.error("Chat error:", error);
      
      // Handle retry for overloaded errors
      if (error.message.includes('overloaded') || error.message.includes('Overloaded') || error.message.includes('high demand')) {
        if (retryCount < MAX_RETRIES) {
          // Update message to show we're retrying
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === loadingId
                ? {
                    ...msg,
                    content: `The AI service is experiencing high demand. Retrying automatically (${retryCount + 1}/${MAX_RETRIES})...`,
                  }
                : msg
            )
          );
          
          // Increment retry count
          setRetryCount((prev) => prev + 1);
          
          // Retry after delay with exponential backoff
          setTimeout(() => {
            sendMessage(content, true);
          }, RETRY_DELAY_MS * Math.pow(2, retryCount));
          
          return;
        }
      }
      
      // If we've exhausted retries or it's another error, show error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                content: retryCount >= MAX_RETRIES 
                  ? "Sorry, the AI service is currently unavailable. Please try again later." 
                  : "Sorry, I encountered an error. Please try again.",
              }
            : msg
        )
      );
      
      // Reset retry state
      setRetryCount(0);
      setRetryMessage(null);
      
      toast({
        title: "Error",
        description: error.message.includes('overloaded') || error.message.includes('Overloaded') || error.message.includes('high demand')
          ? "The AI service is experiencing high demand. Please try again later."
          : "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    project,
    messages,
    isLoading,
    isLoadingProject,
    limitReached,
    sendMessage
  };
}
