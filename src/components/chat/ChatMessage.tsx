
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import { Bot } from "lucide-react";

type ChatMessageProps = {
  content: string;
  isUser: boolean;
  user?: User | null;
  isLoading?: boolean;
};

export function ChatMessage({ content, isUser, user, isLoading = false }: ChatMessageProps) {
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
            <AvatarImage src={user.avatar_url} alt={user.name} />
          )}
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
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
          {isUser ? user?.name || "You" : "Project Assistant"}
        </div>
        <div className={cn("text-sm", isLoading && "animate-pulse")}>
          {isLoading ? "Thinking..." : content}
        </div>
      </div>
    </div>
  );
}
