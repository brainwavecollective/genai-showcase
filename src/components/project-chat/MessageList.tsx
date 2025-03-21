
import { ChatMessage } from '@/components/chat/ChatMessage';
import { User } from '@/types';

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  user: User | null;
}

export function MessageList({ messages, isLoading, user }: MessageListProps) {
  return (
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
  );
}
