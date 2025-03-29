
import { useState } from 'react';
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserStatusBadge from '@/components/users/UserStatusBadge';
import { Pencil, UserCircle, School, CalendarDays } from 'lucide-react';
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

  const getInitials = () => {
    if (displayUser?.first_name && displayUser?.last_name) {
      return `${displayUser.first_name[0]}${displayUser.last_name[0]}`.toUpperCase();
    } 
    if (displayUser?.name) {
      return displayUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return displayUser?.email?.charAt(0).toUpperCase() || 'U';
  };

  const handleEditProfile = () => {
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <Card className="md:col-span-1">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={displayUser?.avatar_url || ''} alt={displayUser?.name || 'User'} />
              <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle>{displayUser?.name || user?.email?.split('@')[0] || 'User'}</CardTitle>
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
            onClick={handleEditProfile}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
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
        onClose={() => setIsEditDialogOpen(false)} 
      />
    </>
  );
};
