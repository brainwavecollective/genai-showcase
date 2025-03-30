
import { User, UserStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, Info, RefreshCcw } from 'lucide-react';

interface UserActionsProps {
  user: User;
  onDetailsClick: (user: User) => void;
  onStatusChange: (userId: string, status: UserStatus) => void;
}

const UserActions = ({ user, onDetailsClick, onStatusChange }: UserActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDetailsClick(user)}
      >
        <Info className="h-4 w-4" />
        <span className="sr-only">Details</span>
      </Button>
      
      {(user.status === 'pending_review' || !user.status) && (
        <>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
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
                  onClick={() => onStatusChange(user.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
                  onClick={() => onStatusChange(user.id, 'denied')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Deny
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
      
      {user.status === 'denied' && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
              <RefreshCcw className="h-4 w-4 mr-1" />
              Approve
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Denied User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve {user.email}? This will make their content visible again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onStatusChange(user.id, 'approved')}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      
      {user.status === 'approved' && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <XCircle className="h-4 w-4 mr-1" />
              Deny
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deny Approved User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to deny {user.email}? This will hide their content from the site.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onStatusChange(user.id, 'denied')}
                className="bg-red-600 hover:bg-red-700"
              >
                Deny
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default UserActions;
