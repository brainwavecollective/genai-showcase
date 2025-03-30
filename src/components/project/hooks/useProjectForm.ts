
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tag } from '@/types';
import { projectFormSchema, ProjectFormValues } from '../schema/projectFormSchema';

export function useProjectForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      is_private: false,
      tag_ids: [],
    },
  });

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data, error } = await supabase
          .from('tags')
          .select('*')
          .order('name');
          
        if (error) throw error;
        setAvailableTags(data || []);
      } catch (error) {
        console.error('Error fetching tags:', error);
        toast({
          title: "Error",
          description: "Failed to load tags. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    fetchTags();
  }, [toast]);

  async function onSubmit(values: ProjectFormValues) {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a project.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert the new project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: values.title,
          description: values.description || '',
          creator_id: user.id,
          is_private: values.is_private,
        })
        .select()
        .single();
        
      if (projectError) throw projectError;
      
      // If tags were selected, create project-tag associations
      if (values.tag_ids && values.tag_ids.length > 0) {
        const tagAssociations = values.tag_ids.map(tagId => ({
          project_id: project.id,
          tag_id: tagId,
        }));
        
        const { error: tagError } = await supabase
          .from('project_tags')
          .insert(tagAssociations);
          
        if (tagError) {
          console.error('Error associating tags:', tagError);
          // Continue anyway, as the project was created successfully
        }
      }
      
      toast({
        title: "Success",
        description: "Your project has been created successfully.",
      });
      
      // Navigate to the new project page
      navigate(`/projects/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit,
  };
}
