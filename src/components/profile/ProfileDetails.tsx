
import { User, getUserFullName } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import UserStatusBadge from '@/components/users/UserStatusBadge';

interface ProfileDetailsProps {
  displayUser: User | null;
  user: User | null;
}

export const ProfileDetails = ({ displayUser, user }: ProfileDetailsProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Private Profile Details</CardTitle>
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
  );
};
