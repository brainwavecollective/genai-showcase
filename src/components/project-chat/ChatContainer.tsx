
import { User } from '@/types';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';

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
  return (
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
      <ChatInput onSend={onSendMessage} isLoading={isLoading} disabled={limitReached} />
    </div>
  );
}
