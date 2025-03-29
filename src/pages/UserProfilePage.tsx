
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { User } from '@/types';
import { GetUserByIdResponse } from '@/types/supabase-functions';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { ProfileDetails } from '@/components/profile/ProfileDetails';
import { ProfileError } from '@/components/profile/ProfileError';
import { ProfileLoading } from '@/components/profile/ProfileLoading';

const UserProfilePage = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if not logged in
  if (!isAuthenticated) {
    toast({
      title: "Access Denied",
      description: "You must be logged in to view your profile",
      variant: "destructive",
    });
    navigate('/');
    return null;
  }

  // Helper function for initials
  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  // Fetch full user details using the RPC function to avoid RLS recursion
  const { data: userDetails, isLoading, error } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      console.log('Fetching user details for ID:', user?.id);
      
      // Use the RPC function instead of direct query to avoid recursion
      const { data, error } = await supabase
        .rpc<GetUserByIdResponse, { user_id: string }>('get_user_by_id', { user_id: user?.id });

      if (error) {
        console.error('Error fetching user details:', error);
        throw error;
      }
      
      console.log('User details fetched successfully:', data);
      return data as unknown as User;
    },
    enabled: !!user?.id,
    retry: 1, // Limit retries since we want to show error quickly
  });

  // Use data from auth context as fallback
  const displayUser = userDetails || user;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-7xl mx-auto px-4 pt-24 pb-16">
          <ProfileError error={error as Error} onLogout={logout} />
        </main>
        <Footer />
      </div>
    );
  }

  // If still loading, show a simplified profile with data from auth context
  if (isLoading && !displayUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-7xl mx-auto px-4 pt-24 pb-16">
          <ProfileLoading user={user} onLogout={logout} getInitials={getInitials} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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
      
      <Footer />
    </div>
  );
};

export default UserProfilePage;
