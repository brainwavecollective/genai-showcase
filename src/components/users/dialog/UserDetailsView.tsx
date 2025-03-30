import { User, getUserFullName } from '@/types';
import { Label } from '@/components/ui/label';
import UserStatusBadge from '../UserStatusBadge';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { UserCircle, School, CalendarDays, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface UserDetailsViewProps {
  user: User;
}

const UserDetailsView = ({ user }: UserDetailsViewProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    return format(new Date(dateString), 'PPP');
  };
  
  const getFullName = () => {
    return getUserFullName(user);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Status</Label>
        <div className="col-span-3">
          <UserStatusBadge status={user.status || 'pending_review'} />
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Email</Label>
        <div className="col-span-3 truncate">{user.email}</div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Name</Label>
        <div className="col-span-3 flex items-center gap-2">
          {getFullName()}
          <Button variant="ghost" size="icon" asChild className="h-6 w-6" title="View bio page">
            <Link to={`/user/${user.id}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Course</Label>
        <div className="col-span-3">{user.course || 'Not set'}</div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Semester</Label>
        <div className="col-span-3">{user.semester || 'Not set'}</div>
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right font-semibold">Notes</Label>
        <div className="col-span-3 whitespace-pre-wrap">{user.notes || 'Not set'}</div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Role</Label>
        <div className="col-span-3 capitalize">{user.role}</div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Created</Label>
        <div className="col-span-3">{formatDate(user.created_at)}</div>
      </div>
    </div>
  );
};

export default UserDetailsView;
