
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag } from '@/types';
import { toast } from 'sonner';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('tags')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        setTags(data || []);
      } catch (error) {
        console.error('Error fetching tags:', error);
        toast.error('Failed to load tags. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTags();
  }, []);

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full inline-block mr-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <div key={tag.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`tag-${tag.id}`}
              checked={selectedTags.includes(tag.id)}
              onCheckedChange={() => handleTagToggle(tag.id)}
            />
            <label 
              htmlFor={`tag-${tag.id}`} 
              className="cursor-pointer flex items-center"
            >
              <Badge variant={selectedTags.includes(tag.id) ? "default" : "outline"}>
                {tag.name}
              </Badge>
            </label>
          </div>
        ))}
      </div>
      
      {tags.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No tags available. Tags will be created by administrators.
        </p>
      )}
    </div>
  );
}
