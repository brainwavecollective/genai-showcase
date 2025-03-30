
import { useState } from 'react';
import { User, UserStatus } from '@/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, Search, Info, RefreshCcw } from 'lucide-react';
import UserStatusBadge from './UserStatusBadge';
import UserDetailsDialog from './UserDetailsDialog';
import { StatusDropdown } from './StatusDropdown';

interface UserListProps {
  users: User[];
  isLoading: boolean;
  onStatusChange: (userId: string, status: UserStatus) => void;
}

const UserList = ({ users, isLoading, onStatusChange }: UserListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.course?.toLowerCase().includes(searchLower)
    );
  });
  
  // Group users by status
  const pendingUsers = filteredUsers.filter(user => user.status === 'pending_review');
  const approvedUsers = filteredUsers.filter(user => user.status === 'approved');
  const deniedUsers = filteredUsers.filter(user => user.status === 'denied');
  const noStatusUsers = filteredUsers.filter(user => !user.status);

  // Combine in this order: pending first, then no status, then approved, then denied
  const sortedUsers = [...pendingUsers, ...noStatusUsers, ...approvedUsers, ...deniedUsers];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
          Pending: {pendingUsers.length + noStatusUsers.length}
        </Badge>
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
          Approved: {approvedUsers.length}
        </Badge>
        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">
          Denied: {deniedUsers.length}
        </Badge>
        <Badge variant="outline">
          Total: {users.length}
        </Badge>
      </div>
      
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted/40 rounded animate-pulse" />
          ))}
        </div>
      ) : sortedUsers.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user.name || 'Not set'}
                  </TableCell>
                  <TableCell>{user.course || 'Not set'}</TableCell>
                  <TableCell>
                    <StatusDropdown 
                      userId={user.id}
                      currentStatus={user.status || 'pending_review'}
                      updateUserStatus={({ userId, status }) => onStatusChange(userId, status)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Details</span>
                      </Button>
                      
                      {(user.status === 'pending_review' || !user.status) && (
                        <>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Approve User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to approve {user.email}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onStatusChange(user.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <XCircle className="h-4 w-4 mr-1" />
                                Deny
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Deny User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to deny {user.email}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onStatusChange(user.id, 'denied')}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Deny
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                      
                      {user.status === 'denied' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                              <RefreshCcw className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Approve Denied User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to approve {user.email}? This will make their content visible again.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onStatusChange(user.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      
                      {user.status === 'approved' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <XCircle className="h-4 w-4 mr-1" />
                              Deny
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Deny Approved User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to deny {user.email}? This will hide their content from the site.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onStatusChange(user.id, 'denied')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Deny
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-md">
          <h3 className="text-lg font-medium">No users found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery ? "Try a different search term" : "Add users to get started"}
          </p>
        </div>
      )}
      
      {selectedUser && (
        <UserDetailsDialog 
          user={selectedUser} 
          open={!!selectedUser} 
          onOpenChange={() => setSelectedUser(null)}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
};

export default UserList;
