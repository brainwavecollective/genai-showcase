
import { motion } from "framer-motion";
import { MediaItem, Comment } from "@/types";
import { MediaHeader } from "./MediaHeader";
import { MediaDescription } from "./MediaDescription";
import { MediaDisplay } from "../MediaDisplay";
import { CommentSection } from "@/components/CommentSection";

interface MediaContentWrapperProps {
  media: MediaItem;
  comments: Comment[];
  onAddComment: (content: string) => void;
  loadingError: string | null;
}

export function MediaContentWrapper({ 
  media, 
  comments, 
  onAddComment, 
  loadingError 
}: MediaContentWrapperProps) {
  return (
    <motion.div
      key={media.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div>
        <MediaHeader media={media} />
        
        <MediaDescription description={media.description} />
        
        <div className="mb-8">
          <MediaDisplay media={media} error={loadingError} />
        </div>
      </div>
      
      <CommentSection 
        comments={comments}
        mediaItemId={media.id}
        onAddComment={onAddComment}
      />
    </motion.div>
  );
}
