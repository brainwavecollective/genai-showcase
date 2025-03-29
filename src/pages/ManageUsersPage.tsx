
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import UserList from '@/components/users/UserList';
import { useUsers } from '@/hooks/useUsers';

export function ManageUsersPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { users, isLoading, error, updateUserStatus } = useUsers();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Not authenticated",
        description: "You must be authenticated to view this page.",
        variant: "destructive",
      });
      navigate('/login');
    } else if (!isAdmin) {
      toast({
        title: "Not authorized",
        description: "You do not have permission to view this page.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate, toast]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Manage Users</h1>
      <UserList 
        users={users} 
        isLoading={isLoading} 
        onStatusChange={updateUserStatus}
      />
    </div>
  );
}

export default ManageUsersPage;
