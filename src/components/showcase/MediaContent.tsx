
import { Badge } from "@/components/ui/badge";
import { MediaDisplay } from "./MediaDisplay";
import { CommentSection } from "@/components/CommentSection";
import { MediaItem, Comment } from "@/types";
import { motion } from "framer-motion";
import { File, Image, LinkIcon, Video, FileText } from 'lucide-react';

interface MediaContentProps {
  selectedMedia: MediaItem | null;
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
}

export function MediaContent({ selectedMedia, comments, onAddComment }: MediaContentProps) {
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
  
  if (!selectedMedia) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Select a media item to view its details</p>
      </div>
    );
  }
  
  return (
    <motion.div
      key={selectedMedia.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-medium">{selectedMedia.title}</h2>
          <Badge variant="outline" className="flex items-center gap-1">
            {getMediaTypeIcon(selectedMedia.mediaType)}
            <span className="capitalize">{selectedMedia.mediaType}</span>
          </Badge>
        </div>
        
        {selectedMedia.description && (
          <p className="text-muted-foreground mb-6">{selectedMedia.description}</p>
        )}
        
        <div className="mb-8">
          <MediaDisplay media={selectedMedia} />
        </div>
      </div>
      
      <CommentSection 
        comments={comments}
        mediaItemId={selectedMedia.id}
        onAddComment={onAddComment}
      />
    </motion.div>
  );
}
