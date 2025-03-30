
import { MediaDisplay } from '@/components/showcase/MediaDisplay';
import { CommentSection } from '@/components/CommentSection';
import { MediaHeader } from './MediaHeader';
import { MediaDescription } from './MediaDescription';
import { MediaItem, Comment } from '@/types';

interface MediaContentWrapperProps {
  media: MediaItem;
  mediaItems: MediaItem[];
  comments: Comment[];
  onAddComment: (content: string) => void;
  loadingError: string | null;
}

export function MediaContentWrapper({ 
  media, 
  mediaItems,
  comments, 
  onAddComment, 
  loadingError 
}: MediaContentWrapperProps) {
  return (
    <div className="space-y-6">
      <MediaHeader media={media} />
      
      <MediaDisplay 
        media={media} 
        mediaItems={mediaItems}
        error={loadingError} 
      />
      
      <MediaDescription description={media.description} />
      
      <CommentSection 
        comments={comments} 
        onSubmitComment={onAddComment} 
      />
    </div>
  );
}
