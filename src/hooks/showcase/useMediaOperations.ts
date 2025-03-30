
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MediaItem } from '@/types';
import { toast } from 'sonner';

export function useMediaOperations(projectId: string | undefined) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  
  // Fetch media items for the project
  useEffect(() => {
    if (!projectId) return;
    
    const fetchMediaItems = async () => {
      try {
        const { data: mediaItems, error } = await supabase
          .from('media_items')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (mediaItems && mediaItems.length > 0) {
          // Set the first media item as selected by default
          setSelectedMedia(mediaItems[0] as unknown as MediaItem);
        }
      } catch (error) {
        console.error('Error fetching media items:', error);
        toast.error('Failed to load media items');
      }
    };
    
    fetchMediaItems();
  }, [projectId]);

  // Handle media selection
  const handleMediaSelect = (media: MediaItem) => {
    setSelectedMedia(media);
  };

  // Handle adding new media
  const handleAddMedia = (media: MediaItem) => {
    if (projectId) {
      // Refresh the media list after adding a new item
      supabase
        .from('media_items')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data && data.length > 0) {
            // Set the newly added media as selected
            const newMedia = data.find(item => item.id === media.id) || data[0];
            setSelectedMedia(newMedia as unknown as MediaItem);
          }
        });
    }
  };

  return {
    selectedMedia,
    handleMediaSelect,
    handleAddMedia
  };
}
