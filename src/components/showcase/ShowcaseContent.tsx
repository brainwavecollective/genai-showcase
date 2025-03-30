
import { useState } from 'react';
import { MediaList } from './MediaList';
import { MediaContent } from './MediaContent';
import { Project, MediaItem, Comment } from '@/types';
import { ProjectReactions } from './ProjectReactions';

interface ShowcaseContentProps {
  project: Project;
  selectedMedia: MediaItem | null;
  mediaItems: MediaItem[];
  comments: Comment[];
  canEdit: boolean;
  onMediaSelect: (media: MediaItem) => void;
  onAddComment: (content: string) => void;
  onMediaAdded: (media: MediaItem) => void;
  isLoading: boolean;
}

export function ShowcaseContent({
  project,
  selectedMedia,
  mediaItems,
  comments,
  canEdit,
  onMediaSelect,
  onAddComment,
  onMediaAdded,
  isLoading
}: ShowcaseContentProps) {
  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
      {/* Left column - Media List */}
      <div className="order-2 lg:order-1">
        <MediaList
          mediaItems={mediaItems}
          selectedMedia={selectedMedia}
          onMediaSelect={onMediaSelect}
          projectId={project.id}
          canEdit={canEdit}
          onMediaAdded={onMediaAdded}
          isLoading={isLoading}
        />
      </div>
      
      {/* Right column - Media Content */}
      <div className="order-1 lg:order-2">
        <MediaContent
          selectedMedia={selectedMedia}
          comments={comments}
          onAddComment={onAddComment}
          mediaItems={mediaItems}
        />
        
        {/* Project reactions */}
        <ProjectReactions projectId={project.id} />
      </div>
    </div>
  );
}
