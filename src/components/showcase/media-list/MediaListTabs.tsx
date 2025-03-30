
import { MediaItem } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MediaTabContent } from './MediaTabContent';

interface MediaListTabsProps {
  mediaItems: MediaItem[];
  selectedMedia: MediaItem | null;
  onMediaSelect: (media: MediaItem) => void;
  isLoading: boolean;
  canEdit: boolean;
  onAddMedia: () => void;
}

export function MediaListTabs({
  mediaItems,
  selectedMedia,
  onMediaSelect,
  isLoading,
  canEdit,
  onAddMedia
}: MediaListTabsProps) {
  return (
    <Tabs defaultValue="all">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
        <TabsTrigger value="images" className="flex-1">Images</TabsTrigger>
        <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
        <TabsTrigger value="others" className="flex-1">Others</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <MediaTabContent
          mediaItems={mediaItems}
          selectedMedia={selectedMedia}
          onMediaSelect={onMediaSelect}
          isLoading={isLoading}
          mediaType="all"
          canEdit={canEdit}
          onAddMedia={onAddMedia}
        />
      </TabsContent>
      
      <TabsContent value="images">
        <MediaTabContent
          mediaItems={mediaItems}
          selectedMedia={selectedMedia}
          onMediaSelect={onMediaSelect}
          isLoading={isLoading}
          mediaType="image"
          canEdit={canEdit}
          onAddMedia={onAddMedia}
        />
      </TabsContent>
      
      <TabsContent value="videos">
        <MediaTabContent
          mediaItems={mediaItems}
          selectedMedia={selectedMedia}
          onMediaSelect={onMediaSelect}
          isLoading={isLoading}
          mediaType="video"
          canEdit={canEdit}
          onAddMedia={onAddMedia}
        />
      </TabsContent>
      
      <TabsContent value="others">
        <MediaTabContent
          mediaItems={mediaItems}
          selectedMedia={selectedMedia}
          onMediaSelect={onMediaSelect}
          isLoading={isLoading}
          mediaType="other"
          canEdit={canEdit}
          onAddMedia={onAddMedia}
        />
      </TabsContent>
    </Tabs>
  );
}
