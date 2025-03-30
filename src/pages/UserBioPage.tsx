
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { Layout } from '@/components/Layout';
import { PublicBioCard } from '@/components/profile/PublicBioCard';
import { LoadingState } from '@/components/showcase/media-content/LoadingState';
import { motion } from 'framer-motion';

const UserBioPage = () => {
  const { userId } = useParams<{ userId: string }>();
  
  // Fetch user data
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['user-bio', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      const { data, error } = await supabase
        .rpc('get_user_by_id', { user_id: userId });
        
      if (error) throw error;
      if (!data) throw new Error('User not found');
      
      return data as unknown as User;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <LoadingState />
        </div>
      </Layout>
    );
  }

  if (error || !userData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">User Not Found</h2>
            <p className="text-muted-foreground mt-2">
              The user you're looking for doesn't exist or is not available.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PublicBioCard user={userData} />
        </motion.div>
      </div>
    </Layout>
  );
};

export default UserBioPage;
