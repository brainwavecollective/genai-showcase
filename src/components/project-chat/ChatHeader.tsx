
import { useNavigate } from 'react-router-dom';
import { Home, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6 flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="gap-2"
      >
        <Home size={16} />
        Back to Home
      </Button>
      <div className="flex items-center gap-2 text-primary">
        <Bot size={20} />
        <h1 className="text-xl font-semibold">Project Assistant</h1>
      </div>
    </div>
  );
}
