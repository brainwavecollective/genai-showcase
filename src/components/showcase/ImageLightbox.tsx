
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaItem } from '@/types';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem;
  mediaItems: MediaItem[];
}

export function ImageLightbox({ isOpen, onClose, media, mediaItems }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Find the current index when the media changes
  useEffect(() => {
    const index = mediaItems.findIndex(item => item.id === media.id);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [media, mediaItems]);
  
  // Function to navigate to the next image
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };
  
  // Function to navigate to the previous image
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };
  
  // Only show lightbox for image media type
  if (!isOpen || !media || media.media_type !== 'image') return null;
  
  const currentMedia = mediaItems[currentIndex];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-lg w-[90vw] h-[80vh] p-0 bg-background/95 backdrop-blur-md">
        <div className="relative w-full h-full flex flex-col">
          {/* Close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 z-50" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          
          {/* Image container */}
          <div className="flex-1 flex items-center justify-center p-4 relative">
            <img 
              src={currentMedia.media_url} 
              alt={currentMedia.title} 
              className="max-h-full max-w-full object-contain"
            />
            
            {/* Navigation buttons */}
            {mediaItems.length > 1 && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-4 rounded-full bg-background/50 hover:bg-background/80"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-4 rounded-full bg-background/50 hover:bg-background/80"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
          
          {/* Caption */}
          <div className="p-4 bg-background/80">
            <h3 className="text-lg font-medium">{currentMedia.title}</h3>
            {currentMedia.description && (
              <p className="text-muted-foreground mt-1">{currentMedia.description}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
