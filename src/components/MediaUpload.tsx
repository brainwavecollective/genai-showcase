
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus } from 'lucide-react';
import { MediaItem } from '@/types';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface MediaUploadProps {
  projectId: string;
  onMediaAdded: (media: MediaItem) => void;
}

export function MediaUpload({ projectId, onMediaAdded }: MediaUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'link' | 'document' | 'text'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaContent, setMediaContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setMediaType('image');
    setMediaUrl('');
    setMediaContent('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to add media");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create media item in the database
      const finalMediaUrl = mediaType === 'text' ? mediaContent : mediaUrl;
      
      // Direct insertion to avoid the infinite recursion issue
      const { data, error } = await supabase
        .from('media_items')
        .insert({
          project_id: projectId,
          title,
          description,
          media_type: mediaType,
          media_url: finalMediaUrl,
          creator_id: user.id
        })
        .select('*, creator:creator_id(first_name, last_name, avatar_url)')
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('No data returned from insert operation');
      }
      
      // Create the media item with creator info from the join
      const creator = data.creator || {};
      const firstName = creator.first_name || '';
      const lastName = creator.last_name || '';
      
      const newMedia: MediaItem = {
        ...data,
        creator_name: `${firstName} ${lastName}`.trim(),
        creator_avatar: creator.avatar_url || null
      };
      
      onMediaAdded(newMedia);
      
      setIsSubmitting(false);
      setIsOpen(false);
      resetForm();
      
      toast.success("Media added successfully");
    } catch (error: any) {
      console.error('Error adding media:', error);
      
      // Fallback approach if we encounter the infinite recursion error
      if (error.message?.includes('infinite recursion') || error.code === '42P17') {
        try {
          // First insert without trying to get creator info
          const { data: insertedData, error: insertError } = await supabase
            .from('media_items')
            .insert({
              project_id: projectId,
              title,
              description,
              media_type: mediaType,
              media_url: mediaType === 'text' ? mediaContent : mediaUrl,
              creator_id: user.id
            })
            .select('*')
            .single();
            
          if (insertError) throw insertError;
          
          if (!insertedData) {
            throw new Error('No data returned from insert operation');
          }
          
          // Separate query to get user info
          const { data: userData } = await supabase
            .from('users')
            .select('first_name, last_name, avatar_url')
            .eq('id', user.id)
            .single();
          
          // Create the complete media item
          const newMedia: MediaItem = {
            ...insertedData,
            creator_name: userData ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() : '',
            creator_avatar: userData?.avatar_url || null
          };
          
          onMediaAdded(newMedia);
          setIsSubmitting(false);
          setIsOpen(false);
          resetForm();
          toast.success("Media added successfully");
          
        } catch (fallbackError: any) {
          console.error('Fallback error adding media:', fallbackError);
          toast.error(`Failed to add media: ${fallbackError.message || 'Unknown error'}`);
          setIsSubmitting(false);
        }
      } else {
        toast.error(`Failed to add media: ${error.message || 'Unknown error'}`);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Media
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md animate-fade-in animate-slide-up">
          <DialogHeader>
            <DialogTitle>Add New Media</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter media title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mediaType">Media Type</Label>
              <Select 
                value={mediaType} 
                onValueChange={(value) => setMediaType(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {mediaType !== 'text' ? (
              <div className="space-y-2">
                <Label htmlFor="mediaUrl">Media URL</Label>
                <Input
                  id="mediaUrl"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://example.com/media"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the URL for your media content
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="mediaContent">Text Content</Label>
                <Textarea
                  id="mediaContent"
                  value={mediaContent}
                  onChange={(e) => setMediaContent(e.target.value)}
                  placeholder="Enter your text content here"
                  rows={5}
                  required
                />
              </div>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting && (
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                )}
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
