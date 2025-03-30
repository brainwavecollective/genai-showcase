
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types';

export function useProjectData(projectId: string | undefined) {
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);

  // Fetch project data
  useEffect(() => {
    if (!projectId) return;
    
    const fetchProject = async () => {
      setIsLoadingProject(true);
      try {
        console.log("Fetching project with ID:", projectId);
        
        const { data, error } = await supabase
          .from("project_details")  // Using project_details view instead of projects table
          .select("*")
          .eq("id", projectId)
          .single();

        if (error) throw error;
        
        console.log("Project data from useProjectData:", data);
        
        setProject(data as unknown as Project);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProject(false);
      }
    };

    fetchProject();
  }, [projectId, toast]);

  return { project, isLoadingProject };
}
