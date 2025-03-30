
import { User } from '@/types';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  limitReached: boolean;
  user: User | null;
  onSendMessage: (message: string) => void;
}

export function ChatContainer({ 
  messages, 
  isLoading, 
  limitReached, 
  user, 
  onSendMessage 
}: ChatContainerProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
      <ScrollArea 
        className="max-h-[500px]" 
        viewportRef={scrollAreaRef}
      >
        <div className="py-1">
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
      <ChatInput onSend={onSendMessage} isLoading={isLoading} disabled={limitReached} />
    </div>
  );
}
