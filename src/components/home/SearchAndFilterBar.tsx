
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tag } from '@/types';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchAndFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTab: 'all' | 'public' | 'private';
  setSelectedTab: (tab: 'all' | 'public' | 'private') => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  tags: Tag[];
  isAuthenticated: boolean;
}

export function SearchAndFilterBar({
  searchQuery,
  setSearchQuery,
  selectedTab,
  setSelectedTab,
  selectedTags,
  setSelectedTags,
  tags,
  isAuthenticated
}: SearchAndFilterBarProps) {
  const [adminTags, setAdminTags] = useState<Tag[]>([]);
  
  useEffect(() => {
    // Filter to only show admin-created tags (for consistency with what users can select)
    const fetchAdminTags = async () => {
      try {
        const { data: adminTagsData, error } = await supabase
          .from('tags')
          .select('*')
          .eq('description', 'Admin created tag')
          .order('name');
          
        if (error) throw error;
        setAdminTags(adminTagsData || []);
      } catch (error) {
        console.error('Error fetching admin tags:', error);
      }
    };
    
    fetchAdminTags();
  }, []);

  const handleTagToggle = (tagId: string) => {
    // Fix: Instead of using a function form that returns a new array,
    // we compute the new array first and then pass it to setSelectedTags
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newSelectedTags);
  };

  // Use adminTags instead of all tags
  const displayTags = adminTags.length > 0 ? adminTags : tags;

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold">Featured Projects</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value as 'all' | 'public' | 'private')}
      >
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
          {isAuthenticated && (
            <TabsTrigger value="private">Private</TabsTrigger>
          )}
        </TabsList>
      </Tabs>

      {/* Tags Filter - Only Admin Tags */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Search className="h-4 w-4 text-muted-foreground mr-1" />
          <span className="text-sm text-muted-foreground">Filter by tags:</span>
          
          {displayTags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedTags.includes(tag.id) ? 'bg-primary' : 'hover:bg-secondary/50'
              }`}
              onClick={() => handleTagToggle(tag.id)}
            >
              {tag.name}
              {selectedTags.includes(tag.id) && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
          
          {selectedTags.length > 0 && (
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-destructive/10 transition-colors"
              onClick={() => setSelectedTags([])}
            >
              Clear All
              <X className="ml-1 h-3 w-3" />
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
