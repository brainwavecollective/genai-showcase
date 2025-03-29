
import { useState, useEffect } from 'react';
import { User, UserStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching users:', error);
          setError(error.message);
        } else {
          const typedUsers = data?.map(user => ({
            ...user,
            role: user.role as User['role'],
            status: user.status as UserStatus
          })) || [];
          setUsers(typedUsers);
        }
      } catch (err: any) {
        console.error('Unexpected error fetching users:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateUserStatus = useMutation({
    mutationFn: async (params: { userId: string; status: UserStatus }) => {
      console.log(`Updating user ${params.userId} status to ${params.status}`);
      
      // Using 'as any' to bypass the TypeScript error while preserving functionality
      const { data, error } = await supabase
        .rpc('update_user_status', {
          p_user_id: params.userId,
          p_status: params.status
        } as any);

      if (error) {
        console.error('Error updating user status:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
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
    isLoading: loading,
    error,
    updateUserStatus: (userId: string, status: UserStatus) => 
      updateUserStatus.mutate({ userId, status })
  };
}
