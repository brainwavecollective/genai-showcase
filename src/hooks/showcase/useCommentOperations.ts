
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Comment, MediaItem, getUserFullName } from '@/types';
import { toast } from 'sonner';

// Define type for the user info returned by the RPC function
interface CommentUserInfo {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export function useCommentOperations(selectedMedia: MediaItem | null) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to parse the user information safely
  const parseUserInfo = (userData: any): CommentUserInfo => {
    if (!userData) {
      return { first_name: null, last_name: null, avatar_url: null };
    }
    
    // If it's an object with the expected properties, use those
    if (typeof userData === 'object' && userData !== null) {
      return {
        first_name: userData.first_name || null,
        last_name: userData.last_name || null,
        avatar_url: userData.avatar_url || null
      };
    }
    
    // Default fallback
    return { first_name: null, last_name: null, avatar_url: null };
  };

  // Fetch comments for a media item
  const fetchComments = useCallback(async (mediaItemId: string) => {
    if (!mediaItemId) return;
    
    try {
      setIsLoading(true);
      console.log(`Fetching comments for media item ${mediaItemId}`);
      
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('media_item_id', mediaItemId)
        .order('created_at', { ascending: false });
      
      if (commentsError) throw commentsError;
      
      // Fetch user info for each comment using our security definer function
      const formattedComments = await Promise.all(
        commentsData.map(async (comment) => {
          // Use the security definer function to get user info
          const { data: userData, error: userError } = await supabase
            .rpc('get_comment_user_info', { comment_user_id: comment.user_id });
          
          if (userError) {
            console.error('Error fetching user info:', userError);
          }
          
          // Parse the user data with proper type handling
          const userInfo = parseUserInfo(userData);
          
          return {
            ...comment,
            user_name: userInfo.first_name && userInfo.last_name ? 
              `${userInfo.first_name} ${userInfo.last_name}`.trim() : 
              'Unknown User',
            user_avatar: userInfo.avatar_url || null
          };
        })
      );
      
      console.log(`Loaded ${formattedComments.length} comments for media item ${mediaItemId}`);
      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear comments when switching media items
  useEffect(() => {
    if (selectedMedia) {
      // Reset the comments state to prevent flickering of old comments
      setComments([]);
      fetchComments(selectedMedia.id);
    }
  }, [selectedMedia, fetchComments]);

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
      
      // Parse the user data with proper type handling
      const userInfo = parseUserInfo(userData);
      
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
    isLoading,
    fetchComments,
    handleAddComment
  };
}
