
import { useState, useEffect } from 'react';
import { MediaItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { MediaUpload } from '@/components/MediaUpload';
import { supabase } from '@/integrations/supabase/client';
import { MediaListHeader } from './media-list/MediaListHeader';
import { MediaListTabs } from './media-list/MediaListTabs';

interface MediaListProps {
  mediaItems?: MediaItem[];
  selectedMedia: MediaItem | null;
  onMediaSelect: (media: MediaItem) => void;
  canEdit: boolean;
  projectId: string;
  onMediaAdded: (media: MediaItem) => void;
}

export function MediaList({ 
  selectedMedia, 
  onMediaSelect, 
  canEdit, 
  projectId, 
  onMediaAdded 
}: MediaListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('media_items')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        // Explicitly cast data as MediaItem[] to handle the media_type field
        setMediaItems(data as unknown as MediaItem[]);
      } catch (error) {
        console.error('Error fetching media items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMediaItems();
  }, [projectId]);

  const handleMediaSelect = (media: MediaItem) => {
    onMediaSelect(media);
  };

  const handleMediaUploaded = (newMedia: MediaItem) => {
    setMediaItems(prev => [newMedia, ...prev]);
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
