import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, UserStatus } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Check, Copy, ArrowDownToLine } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GetUserByIdResponse } from '@/types/supabase-functions';
import { UpdateUserStatusResponse } from '@/types/rpc-types';

interface DataTableProps {
  users: User[];
}

const roleOptions = [
  { value: 'visitor', label: 'Visitor' },
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' },
];

const statusOptions = [
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
];

export function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();

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
          // Cast the role string to UserRole
          const typedUsers = data?.map(user => ({
            ...user,
            role: user.role as UserRole,
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

  // Update user status mutation - Updated to use the secure RPC function
  const updateUserStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: UserStatus }) => {
      console.log(`Updating user ${userId} status to ${status}`);
      
      // Use the secure RPC function instead of direct table update
      const { data, error } = await supabase
        .rpc<UpdateUserStatusResponse>('update_user_status', {
          p_user_id: userId,
          p_status: status
        });

      if (error) {
        console.error('Error updating user status:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch queries after successful update
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

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      console.log(`Updating user ${userId} role to ${role}`);
      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Error updating user role:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch queries after successful update
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Success",
        description: "User role updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: `Failed to update user role: ${error.message || 'An unexpected error occurred'}`,
        variant: "destructive",
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      console.log(`Deleting user ${userId}`);
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch queries after successful update
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message || 'An unexpected error occurred'}`,
        variant: "destructive",
      });
    },
  });

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Manage Users</h1>
      <DataTable users={users} updateUserStatus={updateUserStatus.mutate} updateUserRole={updateUserRole.mutate} deleteUser={deleteUser.mutate} />
    </div>
  );
}

interface UserTableProps {
  users: User[];
  updateUserStatus: (params: { userId: string; status: UserStatus }) => void;
  updateUserRole: (params: { userId: string; role: UserRole }) => void;
  deleteUser: (userId: string) => void;
}

function DataTable({ users, updateUserStatus, updateUserRole, deleteUser }: UserTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <RoleDropdown userId={user.id} currentRole={user.role} updateUserRole={updateUserRole} />
              </TableCell>
              <TableCell>
                <StatusDropdown userId={user.id} currentStatus={user.status} updateUserStatus={updateUserStatus} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy user ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteUser(user.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

interface StatusDropdownProps {
  userId: string;
  currentStatus: UserStatus;
  updateUserStatus: (params: { userId: string; status: UserStatus }) => void;
}

function StatusDropdown({ userId, currentStatus, updateUserStatus }: StatusDropdownProps) {
  const [status, setStatus] = useState<UserStatus>(currentStatus);

  const handleStatusChange = (value: UserStatus) => {
    setStatus(value);
    updateUserStatus({ userId: userId, status: value });
  };

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface RoleDropdownProps {
  userId: string;
  currentRole: UserRole;
  updateUserRole: (params: { userId: string; role: UserRole }) => void;
}

function RoleDropdown({ userId, currentRole, updateUserRole }: RoleDropdownProps) {
  const [role, setRole] = useState<UserRole>(currentRole);

  const handleRoleChange = (value: UserRole) => {
    setRole(value);
    updateUserRole({ userId: userId, role: value });
  };

  return (
    <Select value={role} onValueChange={handleRoleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        {roleOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ManageUsersPage;
