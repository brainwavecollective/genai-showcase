
import { ChatMessage } from '@/components/chat/ChatMessage';
import { User } from '@/types';
import { forwardRef } from 'react';

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

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, isLoading, user }, ref) => {
    return (
      <div className="py-1" ref={ref}>
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
);

MessageList.displayName = 'MessageList';
