
import { useState, useRef, useEffect } from 'react';
import { Bot, X, ChevronRight, ChevronLeft, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { ChatInput } from '@/components/chat/ChatInput';
import { useMessageHandler } from '@/hooks/useMessageHandler';
import { useProjectData } from '@/hooks/useProjectData';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-mobile';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

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
    <>
      {/* Toggle button - fixed to the right edge of the screen when closed */}
      <Button
        variant="default" 
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-50",
          "h-auto px-2 py-6 rounded-l-md rounded-r-none border border-border shadow-md",
          "flex items-center gap-2",
          isOpen ? "translate-x-0 bg-secondary hover:bg-secondary/80" : "bg-primary hover:bg-primary/90"
        )}
        style={{
          transform: isOpen ? 'translateY(-50%)' : 'translateY(-50%)',
          transition: 'all 0.3s ease'
        }}
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
      
      {/* The sliding chat panel with resize functionality */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-40 transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <ResizablePanelGroup direction="horizontal" onLayout={(sizes) => setPanelSize(sizes[0])}>
          <ResizablePanel 
            defaultSize={25} 
            minSize={20} 
            maxSize={40}
          >
            <div className="h-full bg-card border-l shadow-xl flex flex-col">
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
          
          {/* Add a visible resize handle */}
          <ResizableHandle withHandle className="bg-muted hover:bg-muted-foreground/20">
            <div className="h-8 w-2 flex items-center justify-center">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </ResizableHandle>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
