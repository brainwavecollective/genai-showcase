
import { Project, MediaItem, Comment } from '@/types';
import { MediaList } from './MediaList';
import { MediaContent } from './MediaContent';

interface ShowcaseContentProps {
  project: Project;
  selectedMedia: MediaItem | null;
  comments: Comment[];
  canEdit: boolean;
  onMediaSelect: (media: MediaItem) => void;
  onAddComment: (content: string) => void;
  onMediaAdded: (media: MediaItem) => void;
  mediaItems: MediaItem[];
  isLoading?: boolean;
}

export function ShowcaseContent({
  project,
  selectedMedia,
  comments,
  canEdit,
  onMediaSelect,
  onAddComment,
  onMediaAdded,
  mediaItems,
  isLoading = false
}: ShowcaseContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar with media items list */}
      <div className="lg:col-span-1 order-2 lg:order-1">
        <MediaList 
          mediaItems={mediaItems}
          selectedMedia={selectedMedia}
          onMediaSelect={onMediaSelect}
          canEdit={canEdit}
          projectId={project.id}
          onMediaAdded={onMediaAdded}
          isLoading={isLoading}
        />
      </div>
      
      {/* Main content area */}
      <div className="lg:col-span-2 order-1 lg:order-2">
        <MediaContent 
          selectedMedia={selectedMedia}
          comments={comments}
          onAddComment={onAddComment}
        />
      </div>
    </div>
  );
}
