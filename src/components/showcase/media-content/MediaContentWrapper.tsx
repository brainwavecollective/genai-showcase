
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
  isCommentsLoading?: boolean;
}

export function MediaContentWrapper({ 
  media, 
  mediaItems,
  comments, 
  onAddComment, 
  loadingError,
  isCommentsLoading = false
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
        onAddComment={onAddComment}
        mediaItemId={media.id}
        isLoading={isCommentsLoading}
      />
    </div>
  );
}
