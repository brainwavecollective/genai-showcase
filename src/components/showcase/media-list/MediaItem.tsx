
import { MediaItem as MediaItemType } from '@/types';

interface MediaItemProps {
  media: MediaItemType;
  isSelected: boolean;
  onSelect: (media: MediaItemType) => void;
}

export function MediaItemCard({ media, isSelected, onSelect }: MediaItemProps) {
  return (
    <div
      className={`p-2 rounded-lg cursor-pointer border transition-colors ${
        isSelected
          ? 'border-primary bg-accent'
          : 'border-border hover:bg-accent/50'
      }`}
      onClick={() => onSelect(media)}
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
  );
}
