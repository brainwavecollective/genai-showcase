
import { useState } from 'react';
import { MediaItem } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MediaItemCard } from './MediaItem';

interface MediaTabContentProps {
  mediaItems: MediaItem[];
  selectedMedia: MediaItem | null;
  onMediaSelect: (media: MediaItem) => void;
  isLoading: boolean;
  mediaType?: 'image' | 'video' | 'other' | 'all';
  canEdit: boolean;
  onAddMedia: () => void;
}

export function MediaTabContent({
  mediaItems,
  selectedMedia,
  onMediaSelect,
  isLoading,
  mediaType = 'all',
  canEdit,
  onAddMedia
}: MediaTabContentProps) {
  // Filter media items based on the tab
  const filteredItems = mediaItems.filter(media => {
    if (mediaType === 'all') return true;
    if (mediaType === 'image') return media.media_type === 'image';
    if (mediaType === 'video') return media.media_type === 'video';
    if (mediaType === 'other') return media.media_type !== 'image' && media.media_type !== 'video';
    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(mediaType === 'all' ? 3 : 1)].map((_, i) => (
          <Skeleton key={i} className="w-full h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {mediaType !== 'all' ? `${mediaType} ` : ''}media items found</p>
        {canEdit && mediaType === 'all' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={onAddMedia}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Media
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredItems.map((media) => (
        <MediaItemCard
          key={media.id}
          media={media}
          isSelected={selectedMedia?.id === media.id}
          onSelect={onMediaSelect}
        />
      ))}
    </div>
  );
}
