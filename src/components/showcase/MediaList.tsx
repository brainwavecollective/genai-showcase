
import { useState } from 'react';
import { MediaItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { MediaUpload } from '@/components/MediaUpload';
import { MediaListHeader } from './media-list/MediaListHeader';
import { MediaListTabs } from './media-list/MediaListTabs';

interface MediaListProps {
  mediaItems: MediaItem[];
  selectedMedia: MediaItem | null;
  onMediaSelect: (media: MediaItem) => void;
  canEdit: boolean;
  projectId: string;
  onMediaAdded: (media: MediaItem) => void;
  isLoading?: boolean;
}

export function MediaList({ 
  mediaItems,
  selectedMedia, 
  onMediaSelect, 
  canEdit, 
  projectId, 
  onMediaAdded,
  isLoading = false
}: MediaListProps) {
  const [showUpload, setShowUpload] = useState(false);

  const handleMediaSelect = (media: MediaItem) => {
    onMediaSelect(media);
  };

  const handleMediaUploaded = (newMedia: MediaItem) => {
    onMediaAdded(newMedia);
    setShowUpload(false);
  };

  const toggleUpload = () => setShowUpload(!showUpload);

  return (
    <Card>
      <MediaListHeader 
        canEdit={canEdit} 
        showUpload={showUpload} 
        onToggleUpload={toggleUpload} 
      />
      
      <CardContent>
        {showUpload ? (
          <MediaUpload 
            projectId={projectId} 
            onMediaAdded={handleMediaUploaded} 
          />
        ) : (
          <MediaListTabs
            mediaItems={mediaItems}
            selectedMedia={selectedMedia}
            onMediaSelect={handleMediaSelect}
            isLoading={isLoading}
            canEdit={canEdit}
            onAddMedia={toggleUpload}
          />
        )}
      </CardContent>
    </Card>
  );
}
