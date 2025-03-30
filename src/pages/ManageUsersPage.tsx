
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import UserList from '@/components/users/UserList';
import AddUserForm from '@/components/users/AddUserForm';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/hooks/useUsers';
import { UserPlus } from 'lucide-react';

export function ManageUsersPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { users, isLoading, error, updateUserStatus, updateUserInfo } = useUsers();
  const [showAddUserForm, setShowAddUserForm] = useState(false);

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

  const handleAddUserSuccess = () => {
    toast({
      title: "Success",
      description: "User has been added successfully.",
    });
    setShowAddUserForm(false);
  };

  const handleCancelAddUser = () => {
    setShowAddUserForm(false);
  };

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <div className="bg-destructive/10 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-destructive">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-semibold">Manage Users</h1>
          {!showAddUserForm && (
            <Button
              onClick={() => setShowAddUserForm(true)}
              className="flex items-center gap-2"
            >
              <UserPlus size={16} />
              Add User
            </Button>
          )}
        </div>

        {showAddUserForm ? (
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Add New User</h2>
              <Button variant="outline" onClick={handleCancelAddUser}>
                Cancel
              </Button>
            </div>
            <AddUserForm onSuccess={handleAddUserSuccess} />
          </div>
        ) : (
          <UserList 
            users={users} 
            isLoading={isLoading} 
            onStatusChange={updateUserStatus}
            onUserUpdate={updateUserInfo}
          />
        )}
      </div>
    </Layout>
  );
}

export default ManageUsersPage;
