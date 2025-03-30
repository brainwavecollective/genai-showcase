
import { Badge } from "@/components/ui/badge";
import { MediaTypeIcon } from "./MediaTypeIcon";
import { MediaItem } from "@/types";

interface MediaHeaderProps {
  media: MediaItem;
}

export function MediaHeader({ media }: MediaHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-medium">{media.title}</h2>
      <Badge variant="outline" className="flex items-center gap-1">
        <MediaTypeIcon type={media.media_type} />
        <span className="capitalize">{media.media_type}</span>
      </Badge>
    </div>
  );
}
