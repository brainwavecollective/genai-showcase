
import { useState, useEffect } from 'react';
import { useProjectData } from '@/hooks/useProjectData';
import { useMessageHandler } from '@/hooks/useMessageHandler';
import { getWelcomeMessage, Message } from '@/utils/chatUtils';

export function useProjectChatPage(projectId: string | undefined) {
  const { project, isLoadingProject } = useProjectData(projectId);
  const { messages, isLoading, limitReached, sendMessage } = useMessageHandler(project);
  const [initializedMessages, setInitializedMessages] = useState(false);

  // Initial welcome message
  useEffect(() => {
    if (!initializedMessages) {
      const welcomeMessage = getWelcomeMessage();
      setInitializedMessages(true);
      
      // Set welcome message only if there are no existing messages
      // This prevents adding the welcome message multiple times on re-renders
      if (messages.length === 0) {
        setTimeout(() => {
          // We use setTimeout to ensure this runs after initial render
          // to avoid messages being reset by the useMessageHandler hook
          setInitializedMessages(true);
        }, 0);
      }
    }
  }, [initializedMessages, messages.length]);

  return {
    project,
    messages: initializedMessages && messages.length === 0 ? [getWelcomeMessage()] : messages,
    isLoading,
    isLoadingProject,
    limitReached,
    sendMessage
  };
}
