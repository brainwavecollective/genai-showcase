
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TagCreatorProps {
  onTagCreated: (tagId: string, tagName: string) => void;
}

export function TagCreator({ onTagCreated }: TagCreatorProps) {
  const { user, isAdmin } = useAuth();
  const [newTagName, setNewTagName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTagName.trim()) {
      toast.error('Please enter a tag name');
      return;
    }
    
    if (!user) {
      toast.error('You must be logged in to create a tag');
      return;
    }
    
    try {
      setIsCreating(true);
      
      const { data: existingTag, error: checkError } = await supabase
        .from('tags')
        .select('id, name')
        .ilike('name', newTagName.trim())
        .single();
      
      if (existingTag) {
        toast.error(`A tag with the name "${existingTag.name}" already exists`);
        setIsCreating(false);
        return;
      }
      
      const { data: newTag, error } = await supabase
        .from('tags')
        .insert([
          {
            name: newTagName.trim(),
            created_by: user.id,
            description: isAdmin ? 'Admin created tag' : 'User created tag'
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success(`Tag "${newTag.name}" created successfully`);
      onTagCreated(newTag.id, newTag.name);
      setNewTagName('');
      
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleCreateTag} className="flex gap-2 items-end mt-2">
      <div className="flex-1">
        <Label htmlFor="newTag" className="text-sm">
          {isAdmin ? 'Create Admin Tag' : 'Create Custom Tag'}
        </Label>
        <Input
          id="newTag"
          placeholder="Enter new tag name"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          disabled={isCreating}
        />
      </div>
      <Button 
        type="submit" 
        size="sm" 
        disabled={isCreating || !newTagName.trim()}
        className="mb-0.5"
      >
        {isCreating ? (
          <div className="h-4 w-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
        ) : (
          <>
            <PlusCircle className="h-4 w-4 mr-1" />
            Add
          </>
        )}
      </Button>
    </form>
  );
}
