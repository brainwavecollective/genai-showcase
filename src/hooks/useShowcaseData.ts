
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Project, MediaItem, Comment } from '@/types';
import { toast } from 'sonner';

export function useShowcaseData(projectId: string | undefined) {
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [projectTags, setProjectTags] = useState<any[]>([]);
  const [creator, setCreator] = useState<any>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);

  // Fetch project data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const fetchProjectData = async () => {
      if (!projectId) {
        setError('Project ID is missing');
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('project_details')
          .select('*')
          .eq('id', projectId)
          .single();
        
        if (projectError) {
          if (projectError.code === 'PGRST116') {
            setError('Project not found');
          } else {
            setError(`Error fetching project: ${projectError.message}`);
          }
          setIsLoading(false);
          return;
        }
        
        // If project is private and user is not authenticated, show error
        if (projectData.is_private && !isAuthenticated) {
          setError('This project is private. Please sign in to view it.');
          setIsLoading(false);
          return;
        }
        
        setProject(projectData);
        
        // Fetch tags for this project
        if (projectData.tag_ids?.length) {
          const { data: tagsData } = await supabase
            .from('tags')
            .select('*')
            .in('id', projectData.tag_ids);
          
          setProjectTags(tagsData || []);
        }
        
        // Fetch media items for this project
        const { data: mediaItems } = await supabase
          .from('media_items')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
        
        if (mediaItems && mediaItems.length > 0) {
          // Set the first media item as selected by default
          setSelectedMedia(mediaItems[0] as unknown as MediaItem);
          
          // Fetch comments for the first media item
          fetchComments(mediaItems[0].id);
        }
        
        // Fetch creator info if we have a creator_id
        if (projectData.creator_id) {
          const { data: creatorData } = await supabase
            .from('users')
            .select('*')
            .eq('id', projectData.creator_id)
            .single();
          
          setCreator(creatorData);
        }
        
        // Check if user can edit the project
        if (user) {
          setCanEdit(user.role === 'admin' || user.id === projectData.creator_id);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('An unexpected error occurred while fetching the project');
        setIsLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId, isAuthenticated, user]);

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

  // Handle media selection
  const handleMediaSelect = (media: MediaItem) => {
    setSelectedMedia(media);
    fetchComments(media.id);
  };

  // Handle adding new media
  const handleAddMedia = (media: MediaItem) => {
    if (project) {
      // Refresh the media list after adding a new item
      supabase
        .from('media_items')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data && data.length > 0) {
            // Set the newly added media as selected
            const newMedia = data.find(item => item.id === media.id) || data[0];
            setSelectedMedia(newMedia as unknown as MediaItem);
            fetchComments(newMedia.id);
          }
        });
    }
  };

  // Handle privacy toggle
  const handlePrivacyToggle = async (isPrivate: boolean) => {
    if (project && canEdit) {
      try {
        const { error } = await supabase
          .from('projects')
          .update({ is_private: isPrivate })
          .eq('id', project.id);
        
        if (error) throw error;
        
        setProject({
          ...project,
          is_private: isPrivate,
        });
        
        toast.success(`Project is now ${isPrivate ? 'private' : 'public'}`);
      } catch (error) {
        console.error('Error updating project privacy:', error);
        toast.error('Failed to update project privacy');
      }
    }
  };

  return {
    project,
    projectTags,
    creator,
    selectedMedia,
    comments,
    isLoading,
    error,
    canEdit,
    handleMediaSelect,
    handleAddComment,
    handleAddMedia,
    handlePrivacyToggle
  };
}
