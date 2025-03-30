
import { Search } from 'lucide-react';
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
          Get help discovering projects, understanding concepts, or finding specific information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-cu-gold/50 hover:bg-cu-gold/10"
            onClick={() => sendMessage("What kinds of projects are in the showcase?")}
            disabled={disabled}
          >
            <Search size={14} />
            Discover projects
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-cu-gold/50 hover:bg-cu-gold/10"
            onClick={() => sendMessage("Show me projects related to machine learning")}
            disabled={disabled}
          >
            ML projects
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-cu-gold/50 hover:bg-cu-gold/10"
            onClick={() => sendMessage("Which projects use generative AI?")}
            disabled={disabled}
          >
            Generative AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
