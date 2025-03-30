
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Comment, MediaItem, getUserFullName } from '@/types';
import { toast } from 'sonner';

export function useCommentOperations(selectedMedia: MediaItem | null) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);

  // Fetch comments for a media item
  const fetchComments = async (mediaItemId: string) => {
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('media_item_id', mediaItemId)
        .order('created_at', { ascending: false });
      
      if (commentsError) throw commentsError;
      
      // Fetch user info for each comment using our new security definer function
      const formattedComments = await Promise.all(
        commentsData.map(async (comment) => {
          // Use the security definer function to get user info
          const { data: userData, error: userError } = await supabase
            .rpc('get_comment_user_info', { comment_user_id: comment.user_id });
          
          if (userError) {
            console.error('Error fetching user info:', userError);
          }
          
          // Parse the user data
          const userInfo = userData || {};
          
          return {
            ...comment,
            user_name: userInfo.first_name && userInfo.last_name ? 
              `${userInfo.first_name} ${userInfo.last_name}`.trim() : 
              'Unknown User',
            user_avatar: userInfo.avatar_url || null
          };
        })
      );
      
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
      console.log('Adding comment:', {
        mediaId: selectedMedia.id,
        userId: user.id,
        content
      });
      
      const newComment = {
        media_item_id: selectedMedia.id,
        user_id: user.id,
        content
      };
      
      // First insert the comment
      const { data, error } = await supabase
        .from('comments')
        .insert(newComment)
        .select('*')
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('No data returned from comment insertion');
      }
      
      console.log('Comment added successfully:', data);
      
      // Now get the user info using our security definer function
      const { data: userData, error: userError } = await supabase
        .rpc('get_comment_user_info', { comment_user_id: user.id });
        
      if (userError) {
        console.error('Error fetching user info:', userError);
      }
      
      const userInfo = userData || {};
      
      // Format the new comment
      const formattedComment = {
        ...data,
        user_name: userInfo.first_name && userInfo.last_name ? 
          `${userInfo.first_name} ${userInfo.last_name}`.trim() : 
          getUserFullName(user),
        user_avatar: userInfo.avatar_url || null
      };
      
      setComments(prev => [formattedComment, ...prev]);
      toast.success('Comment added successfully');
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error(`Failed to add comment: ${error.message || 'Unknown error'}`);
    }
  };

  return {
    comments,
    fetchComments,
    handleAddComment
  };
}
