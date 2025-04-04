import { MediaItem } from '@/types';
import { File, Image, LinkIcon, Video, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageLightbox } from './ImageLightbox';

interface MediaDisplayProps {
  media: MediaItem;
  mediaItems: MediaItem[];
  error?: string | null;
}

export function MediaDisplay({ media, mediaItems, error }: MediaDisplayProps) {
  const [imgError, setImgError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // If there's an error, display it
  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>
          Error loading media: {error}
        </AlertDescription>
      </Alert>
    );
  }

  switch (media.media_type) {
    case 'image':
      return (
        <>
          <div className="flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden max-h-[500px]">
            {imgError ? (
              <div className="p-8 text-center">
                <Image className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Image failed to load</p>
                <a 
                  href={media.media_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  View image directly
                </a>
              </div>
            ) : (
              <div className="relative group cursor-pointer" onClick={() => setLightboxOpen(true)}>
                <img 
                  src={media.media_url} 
                  alt={media.title} 
                  className="max-w-full max-h-[500px] object-contain"
                  onError={(e) => {
                    console.error("Image failed to load:", media.media_url);
                    setImgError(true);
                  }}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button variant="secondary" className="bg-background/80 hover:bg-background">
                    View Fullscreen
                  </Button>
                </div>
              </div>
            )}
          </div>
          <ImageLightbox 
            isOpen={lightboxOpen} 
            onClose={() => setLightboxOpen(false)} 
            media={media}
            mediaItems={mediaItems.filter(item => item.media_type === 'image')}
          />
        </>
      );
    case 'video':
      return (
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <Video className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p>Video content would be displayed here</p>
          <a 
            href={media.media_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline mt-2 inline-block"
          >
            Open video link
          </a>
        </div>
      );
    case 'link':
      return (
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <LinkIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p>External link content</p>
          <a 
            href={media.media_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline mt-2 inline-block"
          >
            Visit link
          </a>
        </div>
      );
    case 'document':
      return (
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <File className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p>Document would be displayed here</p>
          <a 
            href={media.media_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline mt-2 inline-block"
          >
            Open document
          </a>
        </div>
      );
    case 'text':
      return (
        <div className="bg-muted/10 rounded-lg p-6 text-foreground">
          <p className="whitespace-pre-line">{media.media_url}</p>
        </div>
      );
    default:
      return (
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <File className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p>Unsupported media type: {media.media_type}</p>
        </div>
      );
  }
}
