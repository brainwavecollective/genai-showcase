
import { User, UserStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle } from 'lucide-react';

interface UserStatusActionsProps {
  user: User;
  onStatusChange: (userId: string, status: UserStatus) => void;
  onDialogClose: () => void;
}

const UserStatusActions = ({ user, onStatusChange, onDialogClose }: UserStatusActionsProps) => {
  return (
    <>
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
                    onDialogClose();
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
                      onDialogClose();
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
                  onDialogClose();
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Deny
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default UserStatusActions;
