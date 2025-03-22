
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { TagSelector } from '@/components/project/TagSelector';
import { PrivacyToggle } from '@/components/project/PrivacyToggleField';
import { ImageUrlField } from '@/components/project/ImageUrlField';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export function NewProjectForm() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to create a project');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Please enter a project title');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create new project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            title,
            description,
            cover_image_url: coverImageUrl || null,
            is_private: isPrivate,
            creator_id: user.id
          }
        ])
        .select()
        .single();
      
      if (projectError) throw projectError;
      
      // Add tags if selected
      if (selectedTags.length > 0) {
        const tagMappings = selectedTags.map(tagId => ({
          project_id: projectData.id,
          tag_id: tagId
        }));
        
        const { error: tagError } = await supabase
          .from('project_tags')
          .insert(tagMappings);
          
        if (tagError) {
          console.error('Error adding tags:', tagError);
          // Continue anyway as the project was created
        }
      }
      
      toast.success('Project created successfully!');
      navigate(`/project/${projectData.id}`);
      
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="bg-background border-input">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xl font-semibold">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Project"
                className="bg-background border-input"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xl font-semibold">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="this is my project"
                rows={6}
                className="bg-background border-input resize-none"
              />
            </div>
            
            <ImageUrlField 
              coverImageUrl={coverImageUrl} 
              setCoverImageUrl={setCoverImageUrl} 
            />
            
            <PrivacyToggle 
              isPrivate={isPrivate} 
              setIsPrivate={setIsPrivate} 
            />
            
            <div className="space-y-3">
              <Label className="text-xl font-semibold">Project Tags</Label>
              <div className="bg-background border border-input rounded-md p-4">
                <TagSelector 
                  selectedTags={selectedTags} 
                  onTagsChange={setSelectedTags} 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Create Project
        </Button>
      </div>
    </form>
  );
}
