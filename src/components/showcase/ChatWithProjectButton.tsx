
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";

interface ChatWithProjectButtonProps {
  projectId: string;
}

export function ChatWithProjectButton({ projectId }: ChatWithProjectButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(`/project/${projectId}/chat`)}
      variant="outline"
      className="gap-2"
    >
      <Bot size={16} />
      Chat with AI about this project
    </Button>
  );
}
