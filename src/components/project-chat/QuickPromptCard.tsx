
import { Search, Code, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface QuickPromptCardProps {
  sendMessage: (message: string) => void;
  disabled?: boolean;
}

export function QuickPromptCard({ sendMessage, disabled = false }: QuickPromptCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-gradient bg-gradient-to-r from-cu-gold to-cu-bronze">
          Let's chat about showcase projects
        </CardTitle>
        <CardDescription>
          Chat with our GenAI Professor to get help discovering projects, understanding technologies, or learning about the students.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-cu-gold/50 hover:bg-cu-gold/10"
            onClick={() => sendMessage("What kinds of projects are in the showcase? I'd like to explore more.")}
            disabled={disabled}
          >
            <Search size={14} />
            Discover projects
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2 border-cu-gold/50 hover:bg-cu-gold/10"
            onClick={() => sendMessage("What technologies and tools were used in these projects? I'm interested in learning more about them.")}
            disabled={disabled}
          >
            <Code size={14} />
            Technologies used
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2 border-cu-gold/50 hover:bg-cu-gold/10"
            onClick={() => sendMessage("Tell me about the students who created these projects. What programs are they in?")}
            disabled={disabled}
          >
            <Users size={14} />
            Meet the creators
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
