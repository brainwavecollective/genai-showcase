
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Project } from '@/types';
import { MessageList } from './MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { ProjectList } from './ProjectList';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Bot, Search, AlertCircle } from 'lucide-react';

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

export function ProjectChatContainer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Welcome to the Project Assistant! I can help you discover and understand projects in the ATLAS Institute Generative AI Showcase. What would you like to know?",
      isUser: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjects, setShowProjects] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  // Fetch projects on initial load
  useEffect(() => {
    fetchProjects();
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading || limitReached) return;

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
      // Create context about available projects
      let projectContext = "";
      
      if (projects.length > 0) {
        projectContext = "Available projects: \n" + 
          projects.map(p => 
            `- ${p.title}: ${p.description?.substring(0, 100) || 'No description'} (Tags: ${p.tag_names?.join(', ') || 'None'})`
          ).join('\n');
      }

      // Send to OpenAI via edge function with correctly passed API key
      const response = await supabase.functions.invoke("project-chat", {
        body: { 
          message: content, 
          projectContext 
        },
        // The API key is automatically included in the request by the Supabase client
      });

      if (response.error) {
        console.error('Edge function error:', response.error);
        throw new Error(response.error.message);
      }

      // Check if we've hit the daily limit
      if (response.data.response.includes("number of available free chats for today has been exhausted")) {
        setLimitReached(true);
      }

      // Check if we need to fetch/show projects
      if (
        (content.toLowerCase().includes("show") && content.toLowerCase().includes("project")) ||
        (content.toLowerCase().includes("list") && content.toLowerCase().includes("project")) ||
        content.toLowerCase().includes("what projects") ||
        (messages.length === 1 && !projects.length)
      ) {
        if (!showProjects) {
          setShowProjects(true);
        }
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
        description: "Failed to get response: " + (error instanceof Error ? error.message : "Unknown error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("project_details")
        .select("*")
        .eq("is_private", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data as unknown as Project[]);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <Home size={16} />
          Back to Home
        </Button>
        <div className="flex items-center gap-2 text-primary">
          <Bot size={20} />
          <h1 className="text-xl font-semibold">Project Assistant</h1>
        </div>
      </div>

      {limitReached && (
        <Card className="mb-6 p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Daily Chat Limit Reached</h3>
              <p className="text-sm text-yellow-700 mt-1">
                The number of available free chats for today has been exhausted. 
                Please try again tomorrow or contact daniel@brainwavecollective.ai for assistance.
              </p>
            </div>
          </div>
        </Card>
      )}

      <QuickPromptCard sendMessage={sendMessage} disabled={limitReached} />

      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
          user={user} 
        />
        <ChatInput onSend={sendMessage} isLoading={isLoading} disabled={limitReached} />
      </div>

      {showProjects && projects.length > 0 && (
        <ProjectList 
          projects={projects}
          showProjects={showProjects}
          setShowProjects={setShowProjects}
          navigate={navigate}
        />
      )}
    </motion.div>
  );
}

function QuickPromptCard({ sendMessage, disabled = false }: { sendMessage: (message: string) => void, disabled?: boolean }) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Ask me about showcase projects</CardTitle>
        <CardDescription>
          Get help discovering projects, understanding concepts, or finding specific information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => sendMessage("What kinds of projects are in the showcase?")}
            disabled={disabled}
          >
            <Search size={14} />
            Discover projects
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => sendMessage("Show me projects related to machine learning")}
            disabled={disabled}
          >
            ML projects
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => sendMessage("Which projects use generative AI?")}
            disabled={disabled}
          >
            Generative AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
