
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { TagCreator } from './TagCreator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag } from '@/types';
import { toast } from 'sonner';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const { user, isAdmin } = useAuth();
  const [adminTags, setAdminTags] = useState<Tag[]>([]);
  const [userTags, setUserTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("admin-tags");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        
        // Fetch admin tags (for everyone to select)
        const { data: adminTagsData, error: adminError } = await supabase
          .from('tags')
          .select('*')
          .eq('description', 'Admin created tag')
          .order('name');
          
        if (adminError) throw adminError;
        setAdminTags(adminTagsData || []);
        
        // If user is logged in, fetch their custom tags
        if (user) {
          const { data: userTagsData, error: userError } = await supabase
            .from('tags')
            .select('*')
            .eq('created_by', user.id)
            .eq('description', 'User created tag')
            .order('name');
            
          if (userError) throw userError;
          setUserTags(userTagsData || []);
        }
        
      } catch (error) {
        console.error('Error fetching tags:', error);
        toast.error('Failed to load tags. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTags();
  }, [user]);

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };
  
  const handleTagCreated = (tagId: string, tagName: string) => {
    // Refresh the appropriate tag list based on whether user is admin
    if (isAdmin) {
      setAdminTags(prev => [...prev, { id: tagId, name: tagName, created_by: user?.id || '', description: 'Admin created tag' }]);
    } else {
      setUserTags(prev => [...prev, { id: tagId, name: tagName, created_by: user?.id || '', description: 'User created tag' }]);
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
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="admin-tags">Standard Tags</TabsTrigger>
          {user && <TabsTrigger value="user-tags">My Custom Tags</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="admin-tags" className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {adminTags.map(tag => (
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
          
          {adminTags.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No standard tags available yet.
            </p>
          )}
          
          {isAdmin && <TagCreator onTagCreated={handleTagCreated} />}
        </TabsContent>
        
        {user && (
          <TabsContent value="user-tags" className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {userTags.map(tag => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`user-tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => handleTagToggle(tag.id)}
                  />
                  <label 
                    htmlFor={`user-tag-${tag.id}`} 
                    className="cursor-pointer flex items-center"
                  >
                    <Badge variant={selectedTags.includes(tag.id) ? "default" : "outline"}>
                      {tag.name}
                    </Badge>
                  </label>
                </div>
              ))}
            </div>
            
            {userTags.length === 0 && (
              <p className="text-sm text-muted-foreground">
                You haven't created any custom tags yet.
              </p>
            )}
            
            <TagCreator onTagCreated={handleTagCreated} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
