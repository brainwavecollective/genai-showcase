
import { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { useMessageHandler } from '@/hooks/useMessageHandler';
import { Project } from '@/types';
import { useProjectData } from '@/hooks/useProjectData';

interface FloatingAIAssistantProps {
  projectId: string;
}

export function FloatingAIAssistant({ projectId }: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();
  const { project } = useProjectData(projectId);
  const { messages, isLoading, limitReached, sendMessage } = useMessageHandler(project);
  
  const handleChatButtonClick = () => {
    setIsDrawerOpen(true);
    setIsOpen(false);
  };
  
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
            <Card className="p-4 shadow-lg">
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
              <p className="text-sm text-muted-foreground mb-4">
                Have questions about this project? I can help explain details, techniques used, or answer any questions!
              </p>
              <Button
                onClick={handleChatButtonClick}
                variant="outline"
                className="gap-2 hover:bg-primary/10 transition-colors w-full"
              >
                <Bot size={16} />
                Chat with AI about this project
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => !isDrawerOpen && (isOpen ? handleChatButtonClick() : setIsOpen(!isOpen))}
      >
        <span className="text-primary font-medium text-sm bg-background/80 backdrop-blur-sm py-1 px-3 rounded-full shadow">AI Project Chat</span>
        <Button 
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center bg-primary hover:bg-primary/90"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </motion.div>
      
      {/* Drawer for in-place chat */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Chat with AI about this project
            </DrawerTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Ask questions about this project's implementation, technologies, or features
            </p>
          </DrawerHeader>
          
          <div className="p-4">
            <ScrollArea className="h-[calc(80vh-180px)]">
              <div className="space-y-4">
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
            </ScrollArea>
            
            {limitReached ? (
              <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                You've reached the daily chat limit. Please try again tomorrow.
              </div>
            ) : (
              <div className="mt-4">
                <ChatInput 
                  onSend={sendMessage} 
                  isLoading={isLoading} 
                  disabled={limitReached} 
                />
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
