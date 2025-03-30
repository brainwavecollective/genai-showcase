
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { MessageList } from './MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Bot, Search, AlertCircle } from 'lucide-react';

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

// Maximum number of retries for overloaded API
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000; // 2 seconds

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
  const [limitReached, setLimitReached] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

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
      // Send to Anthropic API via edge function
      const response = await supabase.functions.invoke("project-chat", {
        body: { 
          message: content, 
          projectContext: "General chat assistant for ATLAS Institute Generative AI Showcase" 
        },
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
          : "Failed to get response: " + (error instanceof Error ? error.message : "Unknown error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

