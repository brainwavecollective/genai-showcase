
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { ProjectSection } from '@/components/home/ProjectSection';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Project, Tag } from '@/types';

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch projects and tags data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('project_details')
          .select('*');
          
        if (projectsError) {
          throw projectsError;
        }
        
        // Fetch tags
        const { data: tagsData, error: tagsError } = await supabase
          .from('tags')
          .select('*');
          
        if (tagsError) {
          throw tagsError;
        }
        
        setProjects(projectsData || []);
        setTags(tagsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load projects. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <HeroSection />
        <ProjectSection 
          projects={projects} 
          tags={tags} 
          isLoading={isLoading}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
