
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, ThumbsUp, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Reaction {
  emoji: string;
  count: number;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}

interface ProjectReactionsProps {
  projectId: string;
}

export function ProjectReactions({ projectId }: ProjectReactionsProps) {
  // In a real app, we would fetch the current reactions from the database
  const [reactions, setReactions] = useState<Reaction[]>([
    { emoji: '👍', count: 24, active: false, icon: <ThumbsUp className="h-4 w-4" />, label: 'Like' },
    { emoji: '🔥', count: 18, active: false, icon: <Flame className="h-4 w-4" />, label: 'Fire' },
    { emoji: '✨', count: 12, active: false, icon: <Sparkles className="h-4 w-4" />, label: 'Amazing' },
    { emoji: '❤️', count: 8, active: false, icon: <Heart className="h-4 w-4" />, label: 'Love' },
  ]);

  const handleReaction = (index: number) => {
    setReactions(prevReactions => {
      const newReactions = [...prevReactions];
      // Toggle the active state for this reaction
      const isActive = newReactions[index].active;
      
      // Update the count and active state
      newReactions[index] = {
        ...newReactions[index],
        count: isActive ? newReactions[index].count - 1 : newReactions[index].count + 1,
        active: !isActive,
      };
      
      // In a real app, we would save this to the database
      // For now, just show a toast to simulate it
      toast(
        isActive 
          ? `Removed ${newReactions[index].label} reaction`
          : `Added ${newReactions[index].label} reaction`,
        {
          icon: isActive ? '❌' : newReactions[index].emoji,
        }
      );
      
      return newReactions;
    });
  };

  return (
    <div className="flex flex-wrap gap-2 my-4">
      {reactions.map((reaction, index) => (
        <motion.div
          key={reaction.emoji}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={reaction.active ? "default" : "outline"}
            size="sm"
            className={`gap-2 ${reaction.active ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => handleReaction(index)}
          >
            <span>{reaction.emoji}</span>
            <span>{reaction.count}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
