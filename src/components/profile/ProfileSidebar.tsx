
import { User, getUserFullName } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Edit, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfileSidebarProps {
  user: User | null;
  displayUser: User | null;
  isAdmin: boolean;
  onLogout: () => void;
  isFieldVisible: (field: string) => boolean;
  onEdit: () => void;
}

export function ProfileSidebar({ 
  user, 
  displayUser, 
  isAdmin, 
  onLogout, 
  isFieldVisible,
  onEdit 
}: ProfileSidebarProps) {
  const isOwnProfile = user?.id === displayUser?.id;
  const canEdit = isOwnProfile || isAdmin;
  
  const getInitials = () => {
    if (displayUser) {
      const firstName = displayUser.first_name || '';
      // Only include last name initial if it's public or viewing own profile
      const lastName = isFieldVisible('last_name') && displayUser.last_name 
        ? displayUser.last_name 
        : '';
      
      if (firstName || lastName) {
        return (firstName.charAt(0) + (lastName ? lastName.charAt(0) : '')).toUpperCase();
      }
    }
    return displayUser?.email?.charAt(0).toUpperCase() || 'U';
  };
  
  return (
    <Card>
      <CardHeader className="relative">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            {isFieldVisible('avatar') && displayUser?.avatar_url && (
              <AvatarImage src={displayUser.avatar_url} alt={getUserFullName(displayUser)} />
            )}
            <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
          </Avatar>
          
          <CardTitle className="text-center">
            {displayUser?.first_name || 'User'}{' '}
            {isFieldVisible('last_name') && displayUser?.last_name}
          </CardTitle>
          
          <CardDescription className="text-center">
            {displayUser?.email}
          </CardDescription>
          
          {displayUser?.role && (
            <Badge 
              variant="secondary"
              className={displayUser.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 mt-2' : 'mt-2'}
            >
              {displayUser.role}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {canEdit && (
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={onEdit}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            
            {isOwnProfile && (
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive" 
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        )}
        
        {isAdmin && !isOwnProfile && (
          <p className="text-sm bg-muted p-2 rounded-md">
            <span className="font-medium">Admin note:</span> You're viewing this profile as an administrator.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
