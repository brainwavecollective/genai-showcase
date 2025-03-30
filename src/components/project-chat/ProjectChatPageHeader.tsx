
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot } from 'lucide-react';

interface ProjectChatPageHeaderProps {
  projectId: string | undefined;
}

export function ProjectChatPageHeader({ projectId }: ProjectChatPageHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6 flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={() => navigate(projectId ? `/project/${projectId}` : "/")}
        className="gap-2"
      >
        <ArrowLeft size={16} />
        {projectId ? 'Back to Project' : 'Back to Home'}
      </Button>
      <div className="flex items-center gap-2 text-primary">
        <Bot size={20} />
        <h1 className="text-xl font-semibold">Project Assistant</h1>
      </div>
    </div>
  );
}
