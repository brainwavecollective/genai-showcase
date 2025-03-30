
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types';

export function useProjectData(projectId: string | undefined) {
  const { isAuthenticated } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [projectTags, setProjectTags] = useState<any[]>([]);
  const [creator, setCreator] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);

  // Fetch project data
  useEffect(() => {
    if (!projectId) {
      setError('Project ID is missing');
      setIsLoading(false);
      return;
    }
    
    const fetchProjectData = async () => {
      setIsLoading(true);
      setError(null);
      
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
        
        // Fetch creator info if we have a creator_id
        if (projectData.creator_id) {
          const { data: creatorData } = await supabase
            .from('users')
            .select('*')
            .eq('id', projectData.creator_id)
            .single();
          
          setCreator(creatorData);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('An unexpected error occurred while fetching the project');
        setIsLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId, isAuthenticated]);

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
        
        return true;
      } catch (error) {
        console.error('Error updating project privacy:', error);
        return false;
      }
    }
    return false;
  };

  return {
    project,
    projectTags,
    creator,
    isLoading,
    error,
    canEdit,
    setCanEdit,
    handlePrivacyToggle
  };
}
