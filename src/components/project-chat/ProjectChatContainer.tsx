
import { useState } from 'react';
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
import { Home, Bot, Search } from 'lucide-react';

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
      content: "Welcome to the Project Assistant! I can help you discover and understand projects in the showcase. What would you like to know?",
      isUser: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjects, setShowProjects] = useState(false);

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

      // Check if we need to fetch projects
      if (
        (content.toLowerCase().includes("show") && content.toLowerCase().includes("project")) ||
        (content.toLowerCase().includes("list") && content.toLowerCase().includes("project")) ||
        content.toLowerCase().includes("what projects") ||
        (messages.length === 1 && !projects.length)
      ) {
        fetchProjects();
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
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setProjects(data as unknown as Project[]);
      setShowProjects(true);
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

      <QuickPromptCard sendMessage={sendMessage} />

      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
          user={user} 
        />
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
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

function QuickPromptCard({ sendMessage }: { sendMessage: (message: string) => void }) {
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
          >
            <Search size={14} />
            Discover projects
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => sendMessage("Show me projects related to machine learning")}
          >
            ML projects
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => sendMessage("Which projects use generative AI?")}
          >
            Generative AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
