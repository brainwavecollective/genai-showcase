
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

  return {
    users,
    isLoading,
    error: error ? (error as Error).message : null,
    updateUserStatus: (userId: string, status: UserStatus) => 
      updateUserStatus.mutate({ userId, status })
  };
}
