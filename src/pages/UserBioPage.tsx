
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

  // Query user's projects - modified to fix the not showing projects issue
  const { data: userProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['publicUserProjects', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      console.log('Fetching projects for user ID:', userId);
      
      // Modified query to properly fetch all projects for this creator
      const { data, error } = await supabase
        .from('projects') // Use projects table directly instead of project_details view
        .select('*')
        .eq('creator_id', userId)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user projects:', error);
        throw error;
      }
      
      console.log('User projects fetched:', data);
      return data as Project[];
    },
    enabled: !!userId
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
