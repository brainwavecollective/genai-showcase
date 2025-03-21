
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { TagSelector } from '@/components/project/TagSelector';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, Image, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function NewProjectPage() {
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
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-4xl mx-auto px-4 py-8"
      >
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        </div>
        
        <Separator className="mb-8" />
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter project title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="coverImage"
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        // In a real app, this would open an image upload dialog
                        toast.info('Image upload functionality would open here');
                      }}
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    For demo purposes, you can enter any valid image URL
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="private"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                  <Label htmlFor="private" className="flex items-center cursor-pointer">
                    {isPrivate ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Private Project
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Public Project
                      </>
                    )}
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <Label>Project Tags</Label>
                  <TagSelector 
                    selectedTags={selectedTags} 
                    onTagsChange={setSelectedTags} 
                  />
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
      </motion.div>
    </Layout>
  );
}
