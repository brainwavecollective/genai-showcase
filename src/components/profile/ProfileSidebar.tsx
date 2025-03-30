
import { useState } from 'react';
import { User, getUserFullName } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserStatusBadge from '@/components/users/UserStatusBadge';
import { Pencil, UserCircle, School, CalendarDays, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EditProfileDialog } from './EditProfileDialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileSidebarProps {
  user: User | null;
  displayUser: User | null;
  isAdmin: boolean;
  onLogout: () => void;
}

export const ProfileSidebar = ({ user, displayUser, isAdmin, onLogout }: ProfileSidebarProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<'private' | 'public'>('private');

  const getInitials = () => {
    if (displayUser) {
      const fullName = getUserFullName(displayUser);
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return displayUser?.email?.charAt(0).toUpperCase() || 'U';
  };

  const handleEditProfile = (mode: 'private' | 'public') => {
    setEditMode(mode);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <Card className="md:col-span-1">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={displayUser?.avatar_url || ''} alt={displayUser ? getUserFullName(displayUser) : 'User'} />
              <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle>{displayUser ? getUserFullName(displayUser) : user?.email?.split('@')[0] || 'User'}</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
          {displayUser?.status && (
            <div className="mt-2 flex justify-center">
              <UserStatusBadge status={displayUser.status} />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <UserCircle className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Role:</span>
              <Badge variant="outline" className="ml-2 capitalize">
                {displayUser?.role || 'visitor'}
              </Badge>
            </div>
            
            {displayUser?.course && (
              <div className="flex items-center">
                <School className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Course:</span>
                <span className="ml-2">{displayUser.course}</span>
              </div>
            )}
            
            {displayUser?.semester && (
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Semester:</span>
                <span className="ml-2">{displayUser.semester}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleEditProfile('private')}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Private Profile
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleEditProfile('public')}
          >
            <Globe className="h-4 w-4 mr-2" />
            Edit Public Bio
          </Button>
          
          {isAdmin && (
            <Button 
              variant="outline"
              className="w-full" 
              onClick={() => navigate('/manage-users')}
            >
              Manage Users
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="w-full text-destructive hover:text-destructive"
            onClick={onLogout}
          >
            Logout
          </Button>
        </CardFooter>
      </Card>
      
      <EditProfileDialog 
        user={user} 
        isOpen={isEditDialogOpen}
        mode={editMode}
        onClose={() => setIsEditDialogOpen(false)} 
      />
    </>
  );
};
