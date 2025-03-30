
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, getUserFullName } from "@/types";
import { Bot } from "lucide-react";
import { useEffect, useState } from "react";

type ChatMessageProps = {
  content: string;
  isUser: boolean;
  user?: User | null;
  isLoading?: boolean;
};

export function ChatMessage({ content, isUser, user, isLoading = false }: ChatMessageProps) {
  const displayName = user ? getUserFullName(user) : "You";
  const [formattedContent, setFormattedContent] = useState<string>(content);

  // Format the content with proper paragraph breaks and lists
  useEffect(() => {
    if (!isUser && !isLoading && content) {
      // Format project listings and numbered lists
      let formatted = content
        // Add space after numbered list items (1. Item -> 1. Item)
        .replace(/(\d+\.)\s*(\w)/g, "$1 $2")
        // Convert "-" bullet points to proper list items
        .replace(/\n\s*-\s+/g, "\n• ");

      setFormattedContent(formatted);
    } else {
      setFormattedContent(content);
    }
  }, [content, isUser, isLoading]);
  
  return (
    <div
      className={cn(
        "flex gap-3 p-4",
        isUser ? "bg-muted/30" : "bg-background"
      )}
    >
      {isUser ? (
        <Avatar className="h-8 w-8">
          {user?.avatar_url && (
            <AvatarImage src={user.avatar_url} alt={displayName} />
          )}
          <AvatarFallback>{displayName.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="h-8 w-8 bg-primary-foreground border border-border">
          <AvatarFallback>
            <Bot size={16} className="text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex-1 space-y-2">
        <div className="font-medium">
          {isUser ? displayName : "GenAI Gallery Guide"}
        </div>
        {isLoading ? (
          <div className="text-sm animate-pulse">Thinking...</div>
        ) : (
          <div className="text-sm whitespace-pre-line">
            {formattedContent.split('\n').map((paragraph, index) => {
              // Check if this is a list item
              const isListItem = paragraph.trim().startsWith('•') || /^\d+\./.test(paragraph.trim());
              
              return (
                <p 
                  key={index} 
                  className={cn(
                    "mb-2", 
                    isListItem && "pl-2"
                  )}
                >
                  {paragraph}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
