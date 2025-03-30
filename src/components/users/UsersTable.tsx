
import { User, UserStatus, getUserFullName } from '@/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { StatusDropdown } from './StatusDropdown';
import UserActions from './UserActions';

interface UsersTableProps {
  users: User[];
  onDetailsClick: (user: User) => void;
  onStatusChange: (userId: string, status: UserStatus) => void;
}

const UsersTable = ({ users, onDetailsClick, onStatusChange }: UsersTableProps) => {
  return (
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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {getUserFullName(user)}
              </TableCell>
              <TableCell>{user.course || 'Not set'}</TableCell>
              <TableCell>
                <StatusDropdown 
                  currentStatus={user.status || 'pending_review'}
                />
              </TableCell>
              <TableCell className="text-right">
                <UserActions 
                  user={user} 
                  onDetailsClick={onDetailsClick} 
                  onStatusChange={onStatusChange} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
