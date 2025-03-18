
import { MediaItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Video, LinkIcon, File, FileText } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { MediaUpload } from '@/components/MediaUpload';

interface MediaListProps {
  mediaItems: MediaItem[];
  selectedMedia: MediaItem | null;
  onMediaSelect: (media: MediaItem) => void;
  canEdit: boolean;
  projectId: string;
  onMediaAdded: (media: MediaItem) => void;
}

export function MediaList({ 
  mediaItems, 
  selectedMedia, 
  onMediaSelect,
  canEdit,
  projectId,
  onMediaAdded
}: MediaListProps) {
  // Media type icon mapping
  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'link': return <LinkIcon className="h-4 w-4" />;
      case 'document': return <File className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="sticky top-24 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Media Items</h2>
        {canEdit && (
          <MediaUpload 
            projectId={projectId} 
            onMediaAdded={onMediaAdded}
          />
        )}
      </div>
      
      {mediaItems.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center text-muted-foreground">
            No media items available
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {mediaItems.map((media) => (
              <Card
                key={media.id}
                className={`cursor-pointer transition-all hover:bg-accent/50 ${
                  selectedMedia?.id === media.id ? 'ring-2 ring-primary bg-accent/30' : ''
                }`}
                onClick={() => onMediaSelect(media)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-muted-foreground">
                      {getMediaTypeIcon(media.media_type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium leading-tight">{media.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(media.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
