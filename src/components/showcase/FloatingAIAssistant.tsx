
import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { useMessageHandler } from '@/hooks/useMessageHandler';
import { useProjectData } from '@/hooks/useProjectData';

interface FloatingAIAssistantProps {
  projectId: string;
}

export function FloatingAIAssistant({ projectId }: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { project } = useProjectData(projectId);
  const { messages, isLoading, limitReached, sendMessage } = useMessageHandler(project);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  return (
    <div className="fixed bottom-[40%] right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="mb-2"
          >
            <Card className="p-4 shadow-lg w-[400px] md:w-[460px] lg:w-[500px]">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Project AI Assistant</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0" 
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Chat Messages */}
              <ScrollArea className="h-80 mb-3 pr-2">
                <div className="space-y-2">
                  {messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-2">
                      Ask me anything about this project! I can explain the technologies, features, or implementation details.
                    </p>
                  ) : (
                    messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`text-sm p-2 rounded-lg ${message.isUser ? 'bg-muted ml-4' : 'bg-primary/10 mr-4'}`}
                      >
                        <p className="font-medium text-xs mb-1">{message.isUser ? 'You' : 'AI'}</p>
                        <p>{message.content}</p>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input Area */}
              {limitReached ? (
                <div className="p-2 bg-muted rounded text-sm">
                  You've reached the daily chat limit. Please try again tomorrow.
                </div>
              ) : (
                <div className="flex gap-2">
                  <ChatInput 
                    onSend={sendMessage} 
                    isLoading={isLoading} 
                    disabled={limitReached} 
                  />
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-primary font-medium text-sm bg-background/80 backdrop-blur-sm py-1 px-3 rounded-full shadow">AI Project Chat</span>
        <Button 
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center bg-primary hover:bg-primary/90"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}
