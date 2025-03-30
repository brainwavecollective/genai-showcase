
import { File, Image, LinkIcon, Video, FileText } from 'lucide-react';

interface MediaTypeIconProps {
  type: string;
  className?: string;
}

export function MediaTypeIcon({ type, className }: MediaTypeIconProps) {
  switch (type) {
    case 'image': return <Image className={className || "h-4 w-4"} />;
    case 'video': return <Video className={className || "h-4 w-4"} />;
    case 'link': return <LinkIcon className={className || "h-4 w-4"} />;
    case 'document': return <File className={className || "h-4 w-4"} />;
    case 'text': return <FileText className={className || "h-4 w-4"} />;
    default: return <File className={className || "h-4 w-4"} />;
  }
}
