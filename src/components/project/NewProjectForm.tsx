
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { PrivacyToggleField } from '@/components/project/PrivacyToggleField';
import { TagSelector } from '@/components/project/TagSelector';
import { Tag } from '@/types';

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters."
  }),
  description: z.string().max(500, {
    message: "Description must not exceed 500 characters."
  }).optional(),
  is_private: z.boolean().default(false),
  tag_ids: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewProjectForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  async function onSubmit(values: FormValues) {
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>
          Start a new project to showcase your work. You can add media items after creating the project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project title" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a clear, descriptive title for your project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your project (optional)" 
                      className="resize-y min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of your project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tag_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagSelector
                      availableTags={availableTags}
                      selectedTagIds={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Select tags that describe your project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_private"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PrivacyToggleField
                      label="Project Visibility"
                      description="Control who can see your project"
                      isPublic={!field.value}
                      onChange={(isPublic) => field.onChange(!isPublic)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="flex justify-end px-0 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Project
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
