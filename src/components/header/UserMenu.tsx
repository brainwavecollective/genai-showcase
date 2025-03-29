
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, UserCircle, LayoutDashboard, Users } from 'lucide-react';
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
  const { isAuthenticated, user, logout, isAdmin, isInitializing } = useAuth();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [localIsAuthenticated, setLocalIsAuthenticated] = useState(false);
  const [localUser, setLocalUser] = useState<typeof user>(null);
  const [localIsAdmin, setLocalIsAdmin] = useState(false);

  // This effect ensures the component renders properly after hydration
  useEffect(() => {
    setIsClient(true);
    // Short timeout to ensure we don't show loading state unnecessarily
    const timer = setTimeout(() => setIsLoading(false), 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Use local state to prevent UI flicker during auth state changes
  useEffect(() => {
    if (!isInitializing) {
      setLocalIsAuthenticated(isAuthenticated);
      setLocalUser(user);
      setLocalIsAdmin(isAdmin);
    }
    
    console.log('UserMenu rendered, auth state:', { 
      isAuthenticated, 
      userEmail: user?.email,
      isAdmin,
      isInitializing 
    });
  }, [isAuthenticated, user, isAdmin, isInitializing]);

  const getInitials = () => {
    if (localUser?.name) {
      return localUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return localUser?.email?.charAt(0).toUpperCase() || 'U';
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Sign in button clicked, dispatching open-login-dialog event');
    document.dispatchEvent(new Event('open-login-dialog'));
  };

  // Loading state
  if (!isClient || isLoading || isInitializing) {
    return (
      <Button variant="ghost" size="sm" disabled className="flex items-center gap-1">
        <User className="h-4 w-4" />
        <span className="hidden md:inline">Loading...</span>
      </Button>
    );
  }

  // Only show sign-in button if definitely not authenticated
  if (!localIsAuthenticated) {
    console.log('Rendering sign-in button (not authenticated)');
    return (
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleSignInClick}
        className="flex items-center gap-1"
      >
        <User className="h-4 w-4" />
        <span className="hidden md:inline">Sign in</span>
      </Button>
    );
  }

  // Show the user menu if authenticated
  if (localIsAuthenticated && localUser) {
    console.log('Rendering authenticated user menu for', localUser.name || localUser.email, 'isAdmin:', localIsAdmin);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={localUser?.avatar_url} alt={localUser?.name || 'User'} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline ml-2">{localUser?.name || localUser?.email}</span>
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
          {localIsAdmin && (
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => navigate('/manage-users')}
            >
              <Users className="mr-2 h-4 w-4" />
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

  // Fallback for edge cases
  return null;
}
