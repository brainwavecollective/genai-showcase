import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { User } from '@/types';
import { GetUserByIdResponse } from '@/types/supabase-functions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserStatusBadge from '@/components/users/UserStatusBadge';
import { CalendarDays, Pencil, School, UserCircle } from 'lucide-react';

const UserProfilePage = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if not logged in
  if (!isAuthenticated) {
    toast({
      title: "Access Denied",
      description: "You must be logged in to view your profile",
      variant: "destructive",
    });
    navigate('/');
    return null;
  }

  // Fetch full user details using the RPC function to avoid RLS recursion
  const { data: userDetails, isLoading, error } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      console.log('Fetching user details for ID:', user?.id);
      
      // Use the RPC function instead of direct query to avoid recursion
      const { data, error } = await supabase
        .rpc('get_user_by_id', { user_id: user?.id });

      if (error) {
        console.error('Error fetching user details:', error);
        throw error;
      }
      
      console.log('User details fetched successfully:', data);
      return data as User;
    },
    enabled: !!user?.id,
    retry: 1, // Limit retries since we want to show error quickly
  });

  // Use data from auth context as fallback
  const displayUser = userDetails || user;

  const getInitials = () => {
    if (displayUser?.first_name && displayUser?.last_name) {
      return `${displayUser.first_name[0]}${displayUser.last_name[0]}`.toUpperCase();
    } 
    if (displayUser?.name) {
      return displayUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return displayUser?.email?.charAt(0).toUpperCase() || 'U';
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-7xl mx-auto px-4 pt-24 pb-16">
          <div className="bg-destructive/10 p-4 rounded-md">
            <h2 className="text-destructive font-semibold">Error loading profile</h2>
            <p>{error.message}</p>
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="mr-2"
              >
                Go to Home
              </Button>
              <Button 
                variant="outline" 
                className="text-destructive hover:text-destructive"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If still loading, show a simplified profile with data from auth context
  if (isLoading && !displayUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-7xl mx-auto px-4 pt-24 pb-16">
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
                  onClick={logout}
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
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">User Profile</h1>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Summary */}
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
                <Button variant="outline" className="w-full">
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
                  onClick={logout}
                >
                  Logout
                </Button>
              </CardFooter>
            </Card>

            {/* Profile Details */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>
                  Your personal information and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="account">Account Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <div className="p-2 rounded-md bg-muted/40">
                          {displayUser?.first_name || 'Not set'}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <div className="p-2 rounded-md bg-muted/40">
                          {displayUser?.last_name || 'Not set'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="p-2 rounded-md bg-muted/40">
                        {user?.email}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Course</Label>
                      <div className="p-2 rounded-md bg-muted/40">
                        {displayUser?.course || 'Not set'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Semester</Label>
                      <div className="p-2 rounded-md bg-muted/40">
                        {displayUser?.semester || 'Not set'}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="account" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Account Status</Label>
                      <div className="p-2 rounded-md bg-muted/40 flex items-center">
                        <UserStatusBadge status={displayUser?.status || 'pending_review'} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="p-2 rounded-md bg-muted/40">
                        <Badge variant="outline" className="capitalize">
                          {displayUser?.role || 'visitor'}
                        </Badge>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Account Created</Label>
                      <div className="p-2 rounded-md bg-muted/40">
                        {displayUser?.created_at ? new Date(displayUser.created_at).toLocaleDateString() : 'Unknown'}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfilePage;
