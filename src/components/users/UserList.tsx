
import { useState } from 'react';
import { User, UserStatus } from '@/types';
import UserDetailsDialog from './UserDetailsDialog';
import SearchBar from './SearchBar';
import UserStatusSummary from './UserStatusSummary';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import UsersTable from './UsersTable';

interface UserListProps {
  users: User[];
  isLoading: boolean;
  onStatusChange: (userId: string, status: UserStatus) => void;
  onUserUpdate?: (userId: string, userData: Partial<User>) => void;
}

const UserList = ({ users, isLoading, onStatusChange, onUserUpdate }: UserListProps) => {
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
  
  // Helper function to sort users alphabetically by email
  const sortByEmail = (users: User[]) => {
    return [...users].sort((a, b) => 
      (a.email || '').toLowerCase().localeCompare((b.email || '').toLowerCase())
    );
  };
  
  // Group users by status and sort each group alphabetically by email
  const pendingUsers = sortByEmail(filteredUsers.filter(user => user.status === 'pending_review'));
  const approvedUsers = sortByEmail(filteredUsers.filter(user => user.status === 'approved'));
  const deniedUsers = sortByEmail(filteredUsers.filter(user => user.status === 'denied'));
  const noStatusUsers = sortByEmail(filteredUsers.filter(user => !user.status));

  // Combine in this order: pending first, then no status, then approved, then denied
  const sortedUsers = [...pendingUsers, ...noStatusUsers, ...approvedUsers, ...deniedUsers];
  
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="space-y-4">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <UserStatusSummary users={filteredUsers} />
      
      {isLoading ? (
        <LoadingState />
      ) : sortedUsers.length > 0 ? (
        <UsersTable 
          users={sortedUsers}
          onDetailsClick={handleUserSelect}
          onStatusChange={onStatusChange}
        />
      ) : (
        <EmptyState searchQuery={searchQuery} />
      )}
      
      {selectedUser && (
        <UserDetailsDialog 
          user={selectedUser} 
          open={!!selectedUser} 
          onOpenChange={() => setSelectedUser(null)}
          onStatusChange={onStatusChange}
          onUserUpdate={onUserUpdate}
        />
      )}
    </div>
  );
};

export default UserList;
