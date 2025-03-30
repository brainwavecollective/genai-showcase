
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import ProjectGrid from '@/components/home/ProjectGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Project, Tag } from '@/types';
import { motion } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      document.dispatchEvent(new Event('open-login-dialog'));
      navigate('/');
      return;
    }

    const fetchUserProjects = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user's projects
        const { data: projectData, error: projectError } = await supabase
          .from('project_details')
          .select('*')
          .eq('creator_id', user?.id);
          
        if (projectError) {
          throw projectError;
        }
        
        // Fetch all tags for reference
        const { data: tagData, error: tagError } = await supabase
          .from('tags')
          .select('*');
          
        if (tagError) {
          throw tagError;
        }
        
        setProjects(projectData || []);
        setTags(tagData || []);
      } catch (error) {
        console.error('Error fetching user projects:', error);
        toast.error('Failed to load your projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProjects();
  }, [isAuthenticated, user, navigate]);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-7xl mx-auto px-4 py-8 md:py-12"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage and create your showcase projects
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0 flex items-center gap-2"
            onClick={() => navigate('/project/new')}
          >
            <Plus className="h-4 w-4" />
            Create New Project
          </Button>
        </div>
        
        <Separator className="mb-8" />
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ProjectGrid 
                isLoading={false} 
                visibleProjects={projects} 
                tags={tags} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="public">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ProjectGrid 
                isLoading={false} 
                visibleProjects={projects.filter(p => !p.is_private)} 
                tags={tags} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="private">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ProjectGrid 
                isLoading={false} 
                visibleProjects={projects.filter(p => p.is_private)} 
                tags={tags} 
              />
            )}
          </TabsContent>
        </Tabs>
        
        {!isLoading && projects.length === 0 && (
          <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
            <h3 className="text-xl font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first project to showcase your work
            </p>
            <Button 
              onClick={() => navigate('/project/new')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Project
            </Button>
          </div>
        )}
      </motion.div>
    </Layout>
  );
}
