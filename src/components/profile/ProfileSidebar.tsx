
import { User, getUserFullName } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User as UserIcon, UserCog } from 'lucide-react';
import { useState } from 'react';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';

interface ProfileSidebarProps {
  user: User | null;
  displayUser: User | null;
  isAdmin: boolean;
  onLogout: () => void;
  isFieldVisible: (field: string) => boolean;
}

export function ProfileSidebar({ user, displayUser, isAdmin, onLogout, isFieldVisible }: ProfileSidebarProps) {
  const [editMode, setEditMode] = useState<'private' | 'public'>('private');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
  
  const handleEditPrivate = () => {
    setEditMode('private');
    setIsDialogOpen(true);
  };
  
  const handleEditPublic = () => {
    setEditMode('public');
    setIsDialogOpen(true);
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
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {canEdit && (
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleEditPrivate}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Edit Private Profile
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleEditPublic}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Edit Public Bio
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
      
      {canEdit && (
        <EditProfileDialog 
          user={displayUser} 
          isOpen={isDialogOpen} 
          mode={editMode}
          onClose={() => setIsDialogOpen(false)} 
        />
      )}
    </Card>
  );
}
