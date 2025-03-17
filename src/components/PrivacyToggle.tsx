
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PrivacyToggleProps {
  isPrivate: boolean;
  projectId: string;
  onToggle: (isPrivate: boolean) => void;
}

export function PrivacyToggle({ isPrivate, projectId, onToggle }: PrivacyToggleProps) {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    setIsPending(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      onToggle(!isPrivate);
      setIsPending(false);
      
      toast({
        title: isPrivate ? "Project Visible" : "Project Private",
        description: isPrivate 
          ? "Your project is now visible to everyone" 
          : "Your project is now private and only visible to you",
      });
    }, 500);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="privacy-mode" 
        checked={!isPrivate}
        onCheckedChange={handleToggle}
        disabled={isPending}
        className="data-[state=checked]:bg-green-500"
      />
      <Label htmlFor="privacy-mode" className="flex items-center cursor-pointer">
        {isPrivate ? (
          <>
            <EyeOff className="h-4 w-4 mr-1.5" />
            <span>Private</span>
          </>
        ) : (
          <>
            <Eye className="h-4 w-4 mr-1.5" />
            <span>Public</span>
          </>
        )}
      </Label>
    </div>
  );
}
