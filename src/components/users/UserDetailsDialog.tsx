import { User, UserStatus } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import UserStatusBadge from './UserStatusBadge';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle } from 'lucide-react';

interface UserDetailsDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (userId: string, status: UserStatus) => void;
}

const UserDetailsDialog = ({ user, open, onOpenChange, onStatusChange }: UserDetailsDialogProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    return format(new Date(dateString), 'PPP');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Complete information about this user.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold">Status</Label>
            <div className="col-span-3">
              <UserStatusBadge status={user.status || 'pending_review'} />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold">Email</Label>
            <div className="col-span-3 truncate">{user.email}</div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold">Name</Label>
            <div className="col-span-3">
              {user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : user.name || 'Not set'}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold">Course</Label>
            <div className="col-span-3">{user.course || 'Not set'}</div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold">Semester</Label>
            <div className="col-span-3">{user.semester || 'Not set'}</div>
          </div>
          
          {user.notes && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right font-semibold">Notes</Label>
              <div className="col-span-3 whitespace-pre-wrap">{user.notes}</div>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold">Role</Label>
            <div className="col-span-3 capitalize">{user.role}</div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold">Created</Label>
            <div className="col-span-3">{formatDate(user.created_at)}</div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          
          {/* Show approval button for pending or denied users */}
          {(user.status === 'pending_review' || user.status === 'denied' || !user.status) && (
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-green-600 hover:text-green-700">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve User</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to approve {user.email}?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        onStatusChange(user.id, 'approved');
                        onOpenChange(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              {/* Only show deny button if not already denied */}
              {user.status !== 'denied' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-red-600 hover:text-red-700">
                      <XCircle className="h-4 w-4 mr-1" />
                      Deny
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deny User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to deny {user.email}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          onStatusChange(user.id, 'denied');
                          onOpenChange(false);
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Deny
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
          
          {/* Show deny button for approved users */}
          {user.status === 'approved' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-600 hover:text-red-700">
                  <XCircle className="h-4 w-4 mr-1" />
                  Deny
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deny User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to deny {user.email}? This will hide their content from the site.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onStatusChange(user.id, 'denied');
                      onOpenChange(false);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Deny
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
