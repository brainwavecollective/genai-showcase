
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MediaItem } from '@/types';
import { toast } from 'sonner';

export function useMediaOperations(projectId: string | undefined) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch media items for the project
  useEffect(() => {
    if (!projectId) return;
    
    const fetchMediaItems = async () => {
      try {
        setIsLoading(true);
        
        // We use media_items_with_creator view to get both media details and creator info
        const { data: mediaItems, error } = await supabase
          .from('media_items_with_creator')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching media items:', error);
          throw error;
        }
        
        console.log('Fetched media items:', mediaItems);
        
        if (mediaItems && mediaItems.length > 0) {
          // Cast the data to MediaItem[] and set state
          setMediaItems(mediaItems as unknown as MediaItem[]);
          
          // Set the first media item as selected by default
          setSelectedMedia(mediaItems[0] as unknown as MediaItem);
        } else {
          setMediaItems([]);
          setSelectedMedia(null);
        }
      } catch (error) {
        console.error('Error fetching media items:', error);
        toast.error('Failed to load media items');
      } finally {
        setIsLoading(false);
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
    // Update the media items list with the new media
    setMediaItems(prev => [media, ...prev]);
    
    // Set the newly added media as selected
    setSelectedMedia(media);
  };

  return {
    mediaItems,
    selectedMedia,
    isLoading,
    handleMediaSelect,
    handleAddMedia
  };
}
