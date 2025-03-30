
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';

interface UserStatusSummaryProps {
  users: User[];
}

const UserStatusSummary = ({ users }: UserStatusSummaryProps) => {
  // Filter users by status
  const pendingUsers = users.filter(user => user.status === 'pending_review');
  const approvedUsers = users.filter(user => user.status === 'approved');
  const deniedUsers = users.filter(user => user.status === 'denied');
  const noStatusUsers = users.filter(user => !user.status);

  return (
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
  );
};

export default UserStatusSummary;
