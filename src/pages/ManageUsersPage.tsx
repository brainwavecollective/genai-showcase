
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { User, UserStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import UserStatusBadge from '@/components/users/UserStatusBadge';
import UserList from '@/components/users/UserList';
import AddUserForm from '@/components/users/AddUserForm';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ManageUsersPage = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Redirect if not admin
  if (!isAuthenticated || !isAdmin) {
    toast({
      title: "Access Denied",
      description: "You must be an admin to access this page",
      variant: "destructive",
    });
    navigate('/');
    return null;
  }

  // Fetch all users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as User[];
    },
  });

  // Update user status mutation
  const updateUserStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: UserStatus }) => {
      const { data, error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User Updated",
        description: "User status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive",
      });
    },
  });

  // Handle approve/deny actions
  const handleStatusChange = (userId: string, status: UserStatus) => {
    updateUserStatus.mutate({ userId, status });
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-7xl mx-auto px-4 pt-24 pb-16">
          <div className="bg-destructive/10 p-4 rounded-md">
            <h2 className="text-destructive font-semibold">Error loading users</h2>
            <p>{error.message}</p>
          </div>
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
          <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="users">User List</TabsTrigger>
              <TabsTrigger value="add">Add New User</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-6">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">All Users</h2>
                <UserList 
                  users={users || []} 
                  isLoading={isLoading} 
                  onStatusChange={handleStatusChange}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="add" className="space-y-6">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Add New User</h2>
                <AddUserForm 
                  onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ['users'] });
                  }} 
                />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ManageUsersPage;
