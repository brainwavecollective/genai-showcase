
import { useState, useEffect } from 'react';
import { MediaItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MediaUpload } from '@/components/MediaUpload';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

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
        setMediaItems(data || []);
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Media</CardTitle>
          {canEdit && (
            <Button
              onClick={() => setShowUpload(!showUpload)}
              size="sm"
              variant={showUpload ? "secondary" : "default"}
            >
              {showUpload ? "Cancel" : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Media
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {showUpload ? (
          <MediaUpload 
            projectId={projectId} 
            onComplete={handleMediaUploaded} 
          />
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="images" className="flex-1">Images</TabsTrigger>
              <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
              <TabsTrigger value="others" className="flex-1">Others</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-16 rounded-lg" />
                  ))}
                </div>
              ) : mediaItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No media items found</p>
                  {canEdit && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setShowUpload(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Media
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {mediaItems.map((media) => (
                    <div
                      key={media.id}
                      className={`p-2 rounded-lg cursor-pointer border transition-colors ${
                        selectedMedia?.id === media.id
                          ? 'border-primary bg-accent'
                          : 'border-border hover:bg-accent/50'
                      }`}
                      onClick={() => handleMediaSelect(media)}
                    >
                      <div className="flex items-center gap-3">
                        {media.thumbnail_url ? (
                          <div className="w-12 h-12 rounded overflow-hidden bg-muted">
                            <img 
                              src={media.thumbnail_url} 
                              alt={media.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-muted-foreground">
                            {media.media_type === 'video' ? 'Vid' : 
                             media.media_type === 'image' ? 'Img' : 
                             media.media_type === 'document' ? 'Doc' : 'File'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{media.title}</h4>
                          <p className="text-muted-foreground text-xs truncate">
                            {media.description ? media.description.substring(0, 50) : 'No description'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="images">
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-16 rounded-lg" />
                  ))}
                </div>
              ) : mediaItems.filter(m => m.media_type === 'image').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No images found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {mediaItems
                    .filter(media => media.media_type === 'image')
                    .map((media) => (
                      <div
                        key={media.id}
                        className={`p-2 rounded-lg cursor-pointer border transition-colors ${
                          selectedMedia?.id === media.id
                            ? 'border-primary bg-accent'
                            : 'border-border hover:bg-accent/50'
                        }`}
                        onClick={() => handleMediaSelect(media)}
                      >
                        <div className="flex items-center gap-3">
                          {media.thumbnail_url ? (
                            <div className="w-12 h-12 rounded overflow-hidden bg-muted">
                              <img 
                                src={media.thumbnail_url} 
                                alt={media.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-muted-foreground">
                              Img
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{media.title}</h4>
                            <p className="text-muted-foreground text-xs truncate">
                              {media.description ? media.description.substring(0, 50) : 'No description'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="videos">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="w-full h-16 rounded-lg" />
                </div>
              ) : mediaItems.filter(m => m.media_type === 'video').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No videos found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {mediaItems
                    .filter(media => media.media_type === 'video')
                    .map((media) => (
                      <div
                        key={media.id}
                        className={`p-2 rounded-lg cursor-pointer border transition-colors ${
                          selectedMedia?.id === media.id
                            ? 'border-primary bg-accent'
                            : 'border-border hover:bg-accent/50'
                        }`}
                        onClick={() => handleMediaSelect(media)}
                      >
                        <div className="flex items-center gap-3">
                          {media.thumbnail_url ? (
                            <div className="w-12 h-12 rounded overflow-hidden bg-muted">
                              <img 
                                src={media.thumbnail_url} 
                                alt={media.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-muted-foreground">
                              Vid
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{media.title}</h4>
                            <p className="text-muted-foreground text-xs truncate">
                              {media.description ? media.description.substring(0, 50) : 'No description'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="others">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="w-full h-16 rounded-lg" />
                </div>
              ) : mediaItems.filter(m => m.media_type !== 'image' && m.media_type !== 'video').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No other media found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {mediaItems
                    .filter(media => media.media_type !== 'image' && media.media_type !== 'video')
                    .map((media) => (
                      <div
                        key={media.id}
                        className={`p-2 rounded-lg cursor-pointer border transition-colors ${
                          selectedMedia?.id === media.id
                            ? 'border-primary bg-accent'
                            : 'border-border hover:bg-accent/50'
                        }`}
                        onClick={() => handleMediaSelect(media)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-muted-foreground">
                            {media.media_type === 'document' ? 'Doc' : 'File'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{media.title}</h4>
                            <p className="text-muted-foreground text-xs truncate">
                              {media.description ? media.description.substring(0, 50) : 'No description'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
