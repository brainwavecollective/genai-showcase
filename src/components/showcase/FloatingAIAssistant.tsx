
import { useState, useRef, useEffect } from 'react';
import { Bot, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { useMessageHandler } from '@/hooks/useMessageHandler';
import { useProjectData } from '@/hooks/useProjectData';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-mobile';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface FloatingAIAssistantProps {
  projectId: string;
}

export function FloatingAIAssistant({ projectId }: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { project } = useProjectData(projectId);
  const { messages, isLoading, limitReached, sendMessage } = useMessageHandler(project);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [panelSize, setPanelSize] = useState(25); // Initial panel size percentage
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  // Use different UI components for mobile vs desktop
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            size="icon"
            className="fixed bottom-20 right-4 z-50 rounded-full h-14 w-14 shadow-lg flex items-center justify-center bg-primary hover:bg-primary/90"
          >
            <Bot className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] p-0">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center py-3 px-4 border-b">
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
            
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-2 py-4">
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
            
            <div className="border-t pt-2 px-2">
              <ChatInput 
                onSend={sendMessage} 
                isLoading={isLoading} 
                disabled={limitReached} 
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  
  // Desktop version with slide-out panel and resize functionality
  return (
    <div className="fixed inset-y-0 right-0 z-50 flex items-stretch">
      {/* Toggle button - now positioned relative to the panel and attached to its left edge */}
      <div className="relative z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "absolute right-full top-1/2 -translate-y-1/2",
            "px-2 py-6 rounded-l-md rounded-r-none border border-border shadow-md",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "flex items-center gap-2",
            isOpen && "bg-secondary hover:bg-secondary/80"
          )}
        >
          {isOpen ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="whitespace-nowrap text-xs">AI Chat</span>
            </>
          )}
        </Button>
      </div>
      
      {/* The sliding chat panel with resize functionality */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 20 }}
        className="h-full bg-card border-l shadow-xl flex flex-col"
        style={{ width: `${panelSize}vw`, minWidth: '300px', maxWidth: '600px' }}
      >
        <ResizablePanelGroup direction="horizontal" onLayout={(sizes) => setPanelSize(sizes[0])}>
          <ResizablePanel minSize={15} maxSize={40} defaultSize={25}>
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h4 className="font-semibold">Project AI Assistant</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-2 py-4">
                  {messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-2">
                      Ask me anything about this project! I can explain the technologies, features, or implementation details.
                    </p>
                  ) : (
                    messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`text-sm p-3 rounded-lg ${message.isUser ? 'bg-muted ml-4' : 'bg-primary/10 mr-4'}`}
                      >
                        <p className="font-medium text-xs mb-1">{message.isUser ? 'You' : 'AI'}</p>
                        <p>{message.content}</p>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="border-t p-3">
                <ChatInput 
                  onSend={sendMessage} 
                  isLoading={isLoading} 
                  disabled={limitReached} 
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </motion.div>
    </div>
  );
}
