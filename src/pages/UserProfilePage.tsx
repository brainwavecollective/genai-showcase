
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { User } from '@/types';
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

  // Fetch full user details
  const { data: userDetails, isLoading, error } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      return data as User;
    },
    enabled: !!user?.id,
  });

  const getInitials = () => {
    if (userDetails?.first_name && userDetails?.last_name) {
      return `${userDetails.first_name[0]}${userDetails.last_name[0]}`.toUpperCase();
    } 
    if (userDetails?.name) {
      return userDetails.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-7xl mx-auto px-4 pt-24 pb-16">
          <div className="bg-destructive/10 p-4 rounded-md">
            <h2 className="text-destructive font-semibold">Error loading profile</h2>
            <p>{error.message}</p>
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
                    <AvatarImage src={userDetails?.avatar_url || ''} alt={userDetails?.name || 'User'} />
                    <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{userDetails?.name || 'Loading...'}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
                {userDetails?.status && (
                  <div className="mt-2 flex justify-center">
                    <UserStatusBadge status={userDetails.status} />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <UserCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Role:</span>
                    <Badge variant="outline" className="ml-2 capitalize">
                      {userDetails?.role || 'Loading...'}
                    </Badge>
                  </div>
                  
                  {userDetails?.course && (
                    <div className="flex items-center">
                      <School className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">Course:</span>
                      <span className="ml-2">{userDetails.course}</span>
                    </div>
                  )}
                  
                  {userDetails?.semester && (
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">Semester:</span>
                      <span className="ml-2">{userDetails.semester}</span>
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
                          {userDetails?.first_name || 'Not set'}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <div className="p-2 rounded-md bg-muted/40">
                          {userDetails?.last_name || 'Not set'}
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
                        {userDetails?.course || 'Not set'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Semester</Label>
                      <div className="p-2 rounded-md bg-muted/40">
                        {userDetails?.semester || 'Not set'}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="account" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Account Status</Label>
                      <div className="p-2 rounded-md bg-muted/40 flex items-center">
                        <UserStatusBadge status={userDetails?.status || 'pending_review'} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="p-2 rounded-md bg-muted/40">
                        <Badge variant="outline" className="capitalize">
                          {userDetails?.role || 'Loading...'}
                        </Badge>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Account Created</Label>
                      <div className="p-2 rounded-md bg-muted/40">
                        {userDetails?.created_at ? new Date(userDetails.created_at).toLocaleDateString() : 'Unknown'}
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
