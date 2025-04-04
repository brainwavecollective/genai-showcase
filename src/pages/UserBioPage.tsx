
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, Project, getUserFullName } from '@/types';
import { Layout } from '@/components/Layout';
import { PublicBioCard } from '@/components/profile/PublicBioCard';
import ProjectGrid from '@/components/home/ProjectGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const UserBioPage = () => {
  const { userId } = useParams();
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

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

  // Query user's projects using project_details view like the Index page
  const { data: userProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['publicUserProjects', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      console.log('Fetching projects for user ID:', userId);
      
      try {
        // Use project_details view instead of projects table directly
        const { data, error } = await supabase
          .from('project_details')
          .select('*')
          .eq('creator_id', userId)
          .eq('is_private', false) // Only fetch public projects to avoid permission issues
          .order('updated_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching user projects:', error);
          return []; // Return empty array instead of throwing to prevent query retries
        }
        
        console.log('User projects fetched successfully:', data?.length || 0, 'projects');
        return data as Project[];
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        return []; // Return empty array instead of throwing to prevent query retries
      }
    },
    enabled: !!userId && !!user
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
              <h2 className="text-2xl font-semibold mb-6">Projects by {getUserFullName(user)}</h2>
              
              {projectsLoading ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-lg" />
                  ))}
                </div>
              ) : userProjects && userProjects.length > 0 ? (
                <ProjectGrid projects={userProjects} visibleProjects={userProjects} />
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
