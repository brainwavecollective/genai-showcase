
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useProjectData } from './showcase/useProjectData';
import { useMediaOperations } from './showcase/useMediaOperations';
import { useCommentOperations } from './showcase/useCommentOperations';

export function useShowcaseData(projectId: string | undefined) {
  const { user } = useAuth();
  
  // Compose the smaller hooks
  const { 
    project, 
    projectTags, 
    creator, 
    isLoading: projectLoading, 
    error, 
    canEdit, 
    setCanEdit,
    handlePrivacyToggle 
  } = useProjectData(projectId);
  
  const { 
    mediaItems,
    selectedMedia, 
    isLoading: mediaLoading,
    handleMediaSelect, 
    handleAddMedia 
  } = useMediaOperations(projectId);
  
  const { 
    comments, 
    fetchComments, 
    handleAddComment 
  } = useCommentOperations(selectedMedia);

  // Check if user can edit the project
  useEffect(() => {
    if (user && project) {
      setCanEdit(user.role === 'admin' || user.id === project.creator_id);
    }
  }, [user, project, setCanEdit]);

  // Fetch comments when selected media changes
  useEffect(() => {
    if (selectedMedia) {
      fetchComments(selectedMedia.id);
    }
  }, [selectedMedia, fetchComments]);

  // Wrap the privacy toggle to show toast messages
  const handlePrivacyToggleWithToast = async (isPrivate: boolean) => {
    const success = await handlePrivacyToggle(isPrivate);
    if (success) {
      toast.success(`Project is now ${isPrivate ? 'private' : 'public'}`);
    } else {
      toast.error('Failed to update project privacy');
    }
  };

  const isLoading = projectLoading || mediaLoading;

  return {
    project,
    projectTags,
    creator,
    selectedMedia,
    mediaItems,
    comments,
    isLoading,
    error,
    canEdit,
    handleMediaSelect,
    handleAddComment,
    handleAddMedia,
    handlePrivacyToggle: handlePrivacyToggleWithToast
  };
}
