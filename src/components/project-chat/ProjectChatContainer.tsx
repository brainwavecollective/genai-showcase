
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { MessageList } from './MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { useProjectChat } from '@/hooks/useProjectChat';
import { QuickPromptCard } from './QuickPromptCard';
import { LimitReachedCard } from './LimitReachedCard';
import { ChatHeader } from './ChatHeader';

export function ProjectChatContainer() {
  const { user } = useAuth();
  const { messages, isLoading, limitReached, sendMessage } = useProjectChat();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ChatHeader />

      {limitReached && <LimitReachedCard />}

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
