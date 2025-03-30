
import { useState } from 'react';
import { User, UserStatus } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import UserDetailsView from './dialog/UserDetailsView';
import UserDetailsForm from './dialog/UserDetailsForm';
import UserStatusActions from './dialog/UserStatusActions';
import { Edit, Save, X } from 'lucide-react';

interface UserDetailsDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (userId: string, status: UserStatus) => void;
  onUserUpdate?: (userId: string, userData: Partial<User>) => void;
}

const UserDetailsDialog = ({ 
  user, 
  open, 
  onOpenChange, 
  onStatusChange,
  onUserUpdate 
}: UserDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleSave = (editedUser: Partial<User>) => {
    if (onUserUpdate) {
      onUserUpdate(user.id, editedUser);
    }
    setIsEditing(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>User Details</span>
            {onUserUpdate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditToggle}
                className="flex items-center gap-1"
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edit user information' : 'Complete information about this user.'}
          </DialogDescription>
        </DialogHeader>
        
        {isEditing ? (
          <UserDetailsForm 
            user={user} 
            onSave={handleSave} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <UserDetailsView user={user} />
        )}
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:gap-0">
          {isEditing ? (
            <Button
              onClick={() => {
                const formElement = document.querySelector('form');
                if (formElement) {
                  formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
              }}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
          
          {!isEditing && (
            <UserStatusActions 
              user={user} 
              onStatusChange={onStatusChange} 
              onDialogClose={() => onOpenChange(false)} 
            />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
