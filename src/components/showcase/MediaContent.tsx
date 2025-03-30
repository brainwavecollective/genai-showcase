
import { useState, useEffect } from "react";
import { MediaItem, Comment } from "@/types";
import { EmptyMediaState } from "./media-content/EmptyMediaState";
import { LoadingState } from "./media-content/LoadingState";
import { ErrorState } from "./media-content/ErrorState";
import { MediaContentWrapper } from "./media-content/MediaContentWrapper";
import { toast } from "sonner";

interface MediaContentProps {
  selectedMedia: MediaItem | null;
  comments: Comment[];
  onAddComment: (content: string) => void;
  mediaItems: MediaItem[];
  isCommentsLoading?: boolean;
}

export function MediaContent({ 
  selectedMedia, 
  comments, 
  onAddComment, 
  mediaItems,
  isCommentsLoading = false
}: MediaContentProps) {
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [media, setMedia] = useState<MediaItem | null>(selectedMedia);
  const [isLoading, setIsLoading] = useState(false);

  // Update media when selectedMedia changes
  useEffect(() => {
    setMedia(selectedMedia);
    setLoadingError(null);
    
    if (!selectedMedia) return;
    
    // For debugging - log the media item
    console.log('Media content displaying:', selectedMedia);
    
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
      isCommentsLoading={isCommentsLoading}
    />
  );
}
