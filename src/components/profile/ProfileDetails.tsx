
import { User, getUserFullName } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, GraduationCap, School, Hash } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileDetailsProps {
  displayUser: User | null;
  user: User | null;
  isFieldVisible: (field: string) => boolean;
}

export function ProfileDetails({ displayUser, user, isFieldVisible }: ProfileDetailsProps) {
  const isOwnProfile = user?.id === displayUser?.id;
  
  if (!displayUser) return null;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'n/a';
    return format(new Date(dateString), 'MMMM dd, yyyy');
  };
  
  // Display only first name if last name is private
  const displayName = () => {
    if (!displayUser) return 'User';
    
    const firstName = displayUser.first_name || '';
    const lastName = isFieldVisible('last_name') ? displayUser.last_name || '' : '';
    
    return (firstName + (lastName ? ' ' + lastName : '')).trim() || displayUser.email?.split('@')[0] || 'User';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Profile Details</span>
          {displayUser.role && (
            <Badge 
              variant="secondary"
              className={displayUser.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : ''}
            >
              {displayUser.role}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium">{displayName()}</p>
          </div>
          
          {isFieldVisible('email') && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{displayUser.email}</p>
            </div>
          )}
          
          {(isOwnProfile || displayUser.course) && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center">
                <School className="h-4 w-4 mr-1" /> Course
              </p>
              <p className="font-medium">{displayUser.course || 'Not set'}</p>
            </div>
          )}
          
          {(isOwnProfile || displayUser.semester) && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center">
                <GraduationCap className="h-4 w-4 mr-1" /> Semester
              </p>
              <p className="font-medium">{displayUser.semester || 'Not set'}</p>
            </div>
          )}
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" /> Joined
            </p>
            <p className="font-medium">{formatDate(displayUser.created_at)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" /> Last Updated
            </p>
            <p className="font-medium">{formatDate(displayUser.updated_at)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center">
              <Hash className="h-4 w-4 mr-1" /> ID
            </p>
            <p className="font-medium text-xs text-muted-foreground truncate">{displayUser.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
