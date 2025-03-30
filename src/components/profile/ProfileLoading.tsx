
import { User, getUserFullName } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface ProfileLoadingProps {
  user: User | null;
  onLogout: () => void;
  getInitials: () => string;
}

export const ProfileLoading = ({ user, onLogout, getInitials }: ProfileLoadingProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-3/4 bg-muted rounded"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button variant="outline" className="w-full" disabled>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full text-destructive hover:text-destructive"
              onClick={onLogout}
            >
              Logout
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Loading your information...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-6">
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-3/4 bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
