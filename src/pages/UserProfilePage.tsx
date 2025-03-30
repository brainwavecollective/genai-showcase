
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, getUserFullName } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { ProfileDetails } from '@/components/profile/ProfileDetails';
import { ProfileError } from '@/components/profile/ProfileError';
import { ProfileLoading } from '@/components/profile/ProfileLoading';

const UserProfilePage = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [redirectTriggered, setRedirectTriggered] = useState(false);
  
  // Helper function for initials
  const getInitials = () => {
    if (user) {
      const fullName = getUserFullName(user);
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  // Always define the query, but only enable it conditionally
  const { data: userDetails, isLoading, error } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      console.log('Fetching user details for ID:', user?.id);
      
      const { data, error } = await supabase
        .rpc('get_user_by_id', { user_id: user?.id });

      if (error) {
        console.error('Error fetching user details:', error);
        throw error;
      }
      
      console.log('User details fetched successfully:', data);
      return data as unknown as User;
    },
    enabled: !!user?.id && isAuthenticated,
    retry: 1, // Limit retries since we want to show error quickly
  });

  // Use useEffect for navigation instead of conditional rendering
  useEffect(() => {
    if (!isAuthenticated && !redirectTriggered) {
      setRedirectTriggered(true);
      toast({
        title: "Access Denied",
        description: "You must be logged in to view your profile",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAuthenticated, navigate, toast, redirectTriggered]);

  // If redirect has been triggered, don't render the rest of the component
  if (!isAuthenticated && redirectTriggered) {
    return null;
  }

  // Use data from auth context as fallback
  const displayUser = userDetails || user;

  if (error) {
    return (
      <Layout>
        <main className="flex-1 container max-w-7xl mx-auto px-4 pt-24 pb-16">
          <ProfileError error={error as Error} onLogout={logout} />
        </main>
      </Layout>
    );
  }

  // If still loading, show a simplified profile with data from auth context
  if (isLoading && !displayUser) {
    return (
      <Layout>
        <main className="flex-1 container max-w-7xl mx-auto px-4 pt-24 pb-16">
          <ProfileLoading user={user} onLogout={logout} getInitials={getInitials} />
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-1 container max-w-7xl mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProfileHeader title="User Profile" />

          <div className="grid gap-6 md:grid-cols-3">
            <ProfileSidebar 
              user={user} 
              displayUser={displayUser} 
              isAdmin={isAdmin} 
              onLogout={logout} 
            />
            <ProfileDetails displayUser={displayUser} user={user} />
          </div>
        </motion.div>
      </main>
    </Layout>
  );
};

export default UserProfilePage;
