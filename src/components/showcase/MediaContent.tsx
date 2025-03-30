
import { Badge } from "@/components/ui/badge";
import { MediaDisplay } from "./MediaDisplay";
import { CommentSection } from "@/components/CommentSection";
import { MediaItem, Comment } from "@/types";
import { motion } from "framer-motion";
import { File, Image, LinkIcon, Video, FileText } from 'lucide-react';
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MediaContentProps {
  selectedMedia: MediaItem | null;
  comments: Comment[];
  onAddComment: (content: string) => void;
}

export function MediaContent({ selectedMedia, comments, onAddComment }: MediaContentProps) {
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [media, setMedia] = useState<MediaItem | null>(selectedMedia);
  const [isLoading, setIsLoading] = useState(false);

  // If media is not preloaded, try to fetch it
  useEffect(() => {
    setMedia(selectedMedia);
    setLoadingError(null);
    
    if (!selectedMedia) return;
    
    // For debugging - log the media item
    console.log('Selected media:', selectedMedia);
    
    // Try to fetch additional media details if needed
    const loadMediaDetails = async () => {
      try {
        setIsLoading(true);
        // Check if the media_url is accessible
        if (selectedMedia.media_type === 'image' && selectedMedia.media_url) {
          // We could also test if the URL is valid here if needed
          console.log('Media URL:', selectedMedia.media_url);
        }
        
        // Example: If we need to fetch more details about the media item
        const { data, error } = await supabase
          .from('media_items')
          .select('*')
          .eq('id', selectedMedia.id)
          .single();
          
        if (error) {
          console.error('Error fetching media details:', error);
          setLoadingError(`Could not load full media details: ${error.message}`);
          return;
        }
        
        if (data) {
          console.log('Fetched media details:', data);
          setMedia(data as MediaItem);
        }
      } catch (error) {
        console.error('Error processing media:', error);
        setLoadingError('An unexpected error occurred loading media');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Uncomment if we need to fetch additional details
    // loadMediaDetails();
  }, [selectedMedia]);

  // Media type icon mapping
  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'link': return <LinkIcon className="h-4 w-4" />;
      case 'document': return <File className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };
  
  if (!selectedMedia && !media) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Select a media item to view its details</p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Loading media content...</p>
      </div>
    );
  }
  
  const displayMedia = media || selectedMedia;
  
  if (!displayMedia) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>
          Error: Media content not found
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <motion.div
      key={displayMedia.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-medium">{displayMedia.title}</h2>
          <Badge variant="outline" className="flex items-center gap-1">
            {getMediaTypeIcon(displayMedia.media_type)}
            <span className="capitalize">{displayMedia.media_type}</span>
          </Badge>
        </div>
        
        {displayMedia.description && (
          <p className="text-muted-foreground mb-6">{displayMedia.description}</p>
        )}
        
        <div className="mb-8">
          <MediaDisplay media={displayMedia} error={loadingError} />
        </div>
      </div>
      
      <CommentSection 
        comments={comments}
        mediaItemId={displayMedia.id}
        onAddComment={onAddComment}
      />
    </motion.div>
  );
}
