
import { useState, useEffect } from 'react';
import { User, UserStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export function useUsers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Use React Query for fetching and caching users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase');
      const { data, error } = await supabase.rpc('get_all_users');
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      // Convert to properly typed User array
      return data?.map(user => ({
        ...user,
        role: user.role as User['role'],
        status: user.status as UserStatus
      })) || [];
    }
  });

  const updateUserStatus = useMutation({
    mutationFn: async (params: { userId: string; status: UserStatus }) => {
      console.log(`Updating user ${params.userId} status to ${params.status}`);
      
      const { data, error } = await supabase
        .rpc('update_user_status', {
          p_user_id: params.userId,
          p_status: params.status
        });

      if (error) {
        console.error('Error updating user status:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      // This invalidates the query and triggers a refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      toast({
        title: "Success",
        description: "User status updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: `Failed to update user status: ${error.message || 'An unexpected error occurred'}`,
        variant: "destructive",
      });
    },
  });

  // New mutation for updating user information
  const updateUserInfo = useMutation({
    mutationFn: async (params: { userId: string; userData: Partial<User> }) => {
      console.log(`Updating user ${params.userId} information`, params.userData);
      
      const { data, error } = await supabase
        .from('users')
        .update(params.userData)
        .eq('id', params.userId)
        .select();

      if (error) {
        console.error('Error updating user information:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      toast({
        title: "Success",
        description: "User information updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating user information:', error);
      toast({
        title: "Error",
        description: `Failed to update user information: ${error.message || 'An unexpected error occurred'}`,
        variant: "destructive",
      });
    },
  });

  // Helper function to check if a user is denied
  const isUserDenied = (userId: string): boolean => {
    const user = users.find(u => u.id === userId);
    return user?.status === 'denied';
  };

  return {
    users,
    isLoading,
    error: error ? (error as Error).message : null,
    updateUserStatus: (userId: string, status: UserStatus) => 
      updateUserStatus.mutate({ userId, status }),
    updateUserInfo: (userId: string, userData: Partial<User>) =>
      updateUserInfo.mutate({ userId, userData }),
    isUserDenied
  };
}
