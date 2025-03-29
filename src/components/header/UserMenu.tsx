
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, UserCircle, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export function UserMenu() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);

  // This effect ensures the component renders properly after hydration
  useEffect(() => {
    setIsClient(true);
    console.log('UserMenu rendered, auth state:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  // Only show sign-in button if definitely not authenticated
  if (isClient && !isAuthenticated) {
    return (
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => document.dispatchEvent(new Event('open-login-dialog'))}
        className="flex items-center gap-1"
      >
        <User className="h-4 w-4" />
        <span className="hidden md:inline">Sign in</span>
      </Button>
    );
  }

  // Show the user menu if authenticated
  if (isClient && isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user?.avatar_url} alt={user?.name || 'User'} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline ml-2">{user?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => navigate('/manage-users')}
            >
              <User className="mr-2 h-4 w-4" />
              Manage Users
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Loading state - show a simplified avatar while we wait for auth status
  return (
    <Button variant="ghost" size="sm" disabled className="flex items-center gap-1">
      <Avatar className="h-6 w-6">
        <AvatarFallback>...</AvatarFallback>
      </Avatar>
    </Button>
  );
}
