
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() === "" || isLoading || disabled) return;
    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Chat limit reached for today" : "Ask about this project..."}
          className="min-h-12 flex-1 resize-none"
          disabled={isLoading || disabled}
        />
        <Button
          type="submit"
          size="icon"
          onClick={handleSend}
          disabled={isLoading || message.trim() === "" || disabled}
        >
          <Send size={16} />
        </Button>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {disabled ? (
          "Daily chat limit reached. Please try again tomorrow."
        ) : (
          "Press Enter to send, Shift+Enter for a new line"
        )}
      </div>
    </div>
  );
}
