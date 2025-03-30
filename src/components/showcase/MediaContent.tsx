
import { useState, useEffect } from "react";
import { MediaItem, Comment } from "@/types";
import { EmptyMediaState } from "./media-content/EmptyMediaState";
import { LoadingState } from "./media-content/LoadingState";
import { ErrorState } from "./media-content/ErrorState";
import { MediaContentWrapper } from "./media-content/MediaContentWrapper";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MediaContentProps {
  selectedMedia: MediaItem | null;
  comments: Comment[];
  onAddComment: (content: string) => void;
  mediaItems: MediaItem[];
}

export function MediaContent({ selectedMedia, comments, onAddComment, mediaItems }: MediaContentProps) {
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
  
  if (!selectedMedia && !media) {
    return <EmptyMediaState />;
  }
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  const displayMedia = media || selectedMedia;
  
  if (!displayMedia) {
    return <ErrorState />;
  }
  
  return (
    <MediaContentWrapper
      media={displayMedia}
      mediaItems={mediaItems}
      comments={comments}
      onAddComment={onAddComment}
      loadingError={loadingError}
    />
  );
}
