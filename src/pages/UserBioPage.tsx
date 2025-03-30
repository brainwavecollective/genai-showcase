
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, Project } from '@/types';
import { Layout } from '@/components/Layout';
import { PublicBioCard } from '@/components/profile/PublicBioCard';
import ProjectGrid from '@/components/home/ProjectGrid';
import { Skeleton } from '@/components/ui/skeleton';

const UserBioPage = () => {
  const { userId } = useParams();
  const [error, setError] = useState<string | null>(null);

  // Query user details
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['publicUser', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      const { data, error } = await supabase
        .rpc('get_user_by_id', { user_id: userId });
      
      if (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user profile');
        throw error;
      }
      
      if (!data) {
        setError('User not found');
        throw new Error('User not found');
      }
      
      return data as unknown as User;
    }
  });

  // Query user's projects - fixing infinite recursion issue by using a direct query
  const { data: userProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['publicUserProjects', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      console.log('Fetching projects for user ID:', userId);
      
      // Using public.projects table without joining to users to avoid RLS recursion
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id, 
          title, 
          description, 
          cover_image_url, 
          created_at, 
          updated_at, 
          is_private, 
          creator_id
        `)
        .eq('creator_id', userId)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user projects:', error);
        throw error;
      }
      
      // Since we aren't using project_details view, we need to manually add creator_name
      // But we already have the user's info from the previous query
      const projectsWithCreatorName = data?.map(project => ({
        ...project,
        creator_name: user?.first_name && user?.last_name 
          ? `${user.first_name} ${user.last_name}`.trim() 
          : user?.first_name || 'Unknown'
      }));
      
      console.log('User projects fetched:', projectsWithCreatorName);
      return projectsWithCreatorName as Project[];
    },
    enabled: !!userId && !!user // Only run this query when we have both userId and user data
  });

  return (
    <Layout>
      <main className="flex-1 container max-w-7xl mx-auto px-4 pt-28 pb-16">
        {userLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-destructive mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : user ? (
          <div className="space-y-10">
            <PublicBioCard user={user} />
            
            {/* User's Projects Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Projects by {user.first_name || 'this user'}</h2>
              
              {projectsLoading ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-lg" />
                  ))}
                </div>
              ) : userProjects && userProjects.length > 0 ? (
                <ProjectGrid projects={userProjects} />
              ) : (
                <div className="text-center py-10 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">No public projects available</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </Layout>
  );
};

export default UserBioPage;
