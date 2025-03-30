
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus } from 'lucide-react';
import { MediaItem, getUserFullName } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';

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
  const { toast } = useToast();
  const { user } = useAuth();

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setMediaType('image');
    setMediaUrl('');
    setMediaContent('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create media item
    const finalMediaUrl = mediaType === 'text' ? mediaContent : mediaUrl;
    
    // In a real app, this would be an API call
    setTimeout(() => {
      // Create new media item with mock ID and creator data
      const newMedia: MediaItem = {
        id: `new-${Date.now()}`,
        project_id: projectId,
        title,
        description,
        media_type: mediaType,
        media_url: finalMediaUrl,
        creator_id: user?.id || '',
        creator_name: user ? getUserFullName(user) : undefined,
        creator_avatar: user?.avatar_url,
        created_at: new Date().toISOString(),
      };
      
      onMediaAdded(newMedia);
      
      setIsSubmitting(false);
      setIsOpen(false);
      resetForm();
      
      toast({
        title: "Media Added",
        description: "Your new media item has been added successfully.",
      });
    }, 1000);
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
                  For demo purposes, enter any valid URL
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
