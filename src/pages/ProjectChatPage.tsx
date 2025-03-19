
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { useAuth } from '@/context/AuthContext';
import { Project } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ArrowDown, Bot, Home, Search } from 'lucide-react';
import { motion } from 'framer-motion';

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

const ProjectChatPage = () => {
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

      // Send to OpenAI via edge function with explicit headers
      const response = await supabase.functions.invoke("project-chat", {
        body: { 
          message: content, 
          projectContext 
        },
        headers: {
          apikey: supabase.supabaseKey, // Add the API key explicitly
          'Content-Type': 'application/json'
        }
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
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
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

            {showProjects && projects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recent Projects</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowProjects(!showProjects)}
                  >
                    <ArrowDown className={`h-4 w-4 transition-transform ${showProjects ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <Card 
                      key={project.id} 
                      className="cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{project.title}</CardTitle>
                        <CardDescription className="text-xs">
                          By {project.creator_name || "Anonymous"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description || "No description provided"}
                        </p>
                        {project.tag_names && project.tag_names.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.tag_names.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                            {project.tag_names.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{project.tag_names.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectChatPage;
