
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Comment, MediaItem } from '@/types';
import { toast } from 'sonner';

export function useCommentOperations(selectedMedia: MediaItem | null) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);

  // Fetch comments for a media item
  const fetchComments = async (mediaItemId: string) => {
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          users:user_id (
            name,
            avatar_url
          )
        `)
        .eq('media_item_id', mediaItemId)
        .order('created_at', { ascending: false });
      
      if (commentsError) throw commentsError;
      
      // Format comments to match the Comment type
      const formattedComments = commentsData.map((comment: any) => ({
        ...comment,
        user_name: comment.users?.name || 'Unknown User',
        user_avatar: comment.users?.avatar_url || null
      }));
      
      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    }
  };

  // Handle adding new comment
  const handleAddComment = async (content: string) => {
    if (!selectedMedia || !isAuthenticated || !user) {
      toast.error('You must be logged in to comment');
      return;
    }
    
    try {
      const newComment = {
        media_item_id: selectedMedia.id,
        user_id: user.id,
        content
      };
      
      const { data, error } = await supabase
        .from('comments')
        .insert(newComment)
        .select(`
          *,
          users:user_id (
            name,
            avatar_url
          )
        `)
        .single();
      
      if (error) throw error;
      
      // Format the new comment
      const formattedComment = {
        ...data,
        user_name: data.users?.name || user.name || 'Unknown User',
        user_avatar: data.users?.avatar_url || null
      };
      
      setComments(prev => [formattedComment, ...prev]);
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  return {
    comments,
    fetchComments,
    handleAddComment
  };
}
