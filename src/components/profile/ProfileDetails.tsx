
import { User, getUserFullName } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, GraduationCap, School, Hash, Mail, MapPin, BookOpen } from 'lucide-react';
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
          <span>Profile Information</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              <div className="grid gap-2">
                <div className="flex items-start">
                  <div className="w-28 flex-shrink-0 text-sm text-muted-foreground">Full Name:</div>
                  <div className="font-medium">{displayName()}</div>
                </div>
                
                {isFieldVisible('email') && (
                  <div className="flex items-start">
                    <div className="w-28 flex-shrink-0 text-sm text-muted-foreground flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1" /> Email:
                    </div>
                    <div className="font-medium">{displayUser.email}</div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Education</h3>
              <div className="grid gap-2">
                {(isOwnProfile || displayUser.course) && (
                  <div className="flex items-start">
                    <div className="w-28 flex-shrink-0 text-sm text-muted-foreground flex items-center">
                      <School className="h-3.5 w-3.5 mr-1" /> Course:
                    </div>
                    <div className="font-medium">{displayUser.course || 'Not set'}</div>
                  </div>
                )}
                
                {(isOwnProfile || displayUser.semester) && (
                  <div className="flex items-start">
                    <div className="w-28 flex-shrink-0 text-sm text-muted-foreground flex items-center">
                      <GraduationCap className="h-3.5 w-3.5 mr-1" /> Semester:
                    </div>
                    <div className="font-medium">{displayUser.semester || 'Not set'}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Account Information</h3>
              <div className="grid gap-2">
                <div className="flex items-start">
                  <div className="w-28 flex-shrink-0 text-sm text-muted-foreground flex items-center">
                    <CalendarDays className="h-3.5 w-3.5 mr-1" /> Joined:
                  </div>
                  <div className="font-medium">{formatDate(displayUser.created_at)}</div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-28 flex-shrink-0 text-sm text-muted-foreground flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" /> Updated:
                  </div>
                  <div className="font-medium">{formatDate(displayUser.updated_at)}</div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-28 flex-shrink-0 text-sm text-muted-foreground flex items-center">
                    <Hash className="h-3.5 w-3.5 mr-1" /> ID:
                  </div>
                  <div className="font-medium text-xs text-muted-foreground truncate">{displayUser.id}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
