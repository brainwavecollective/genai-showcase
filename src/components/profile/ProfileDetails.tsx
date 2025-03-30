
import { User, getUserFullName } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProfileDetailsProps {
  displayUser: User | null;
  user: User | null;
}

export const ProfileDetails = ({ displayUser, user }: ProfileDetailsProps) => {
  if (!displayUser) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Private Profile Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Full Name</h3>
            <p>{getUserFullName(displayUser)}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Email</h3>
            <p>{displayUser.email}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Role</h3>
            <Badge variant="outline" className="capitalize">{displayUser.role || 'visitor'}</Badge>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Status</h3>
            <Badge variant={displayUser.status === 'approved' ? 'success' : 'secondary'} className="capitalize">
              {displayUser.status || 'pending'}
            </Badge>
          </div>
          
          {displayUser.course && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Course</h3>
              <p>{displayUser.course}</p>
            </div>
          )}
          
          {displayUser.semester && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Semester</h3>
              <p>{displayUser.semester}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
