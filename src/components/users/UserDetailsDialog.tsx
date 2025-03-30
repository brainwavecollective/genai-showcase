
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
    console.log('UserDetailsDialog - handleSave called with:', editedUser);
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
                // Get the form element from UserDetailsForm
                const form = document.querySelector('form');
                if (form) {
                  // Get the current form data
                  const formData = new FormData(form);
                  const userData: Partial<User> = {};
                  
                  // Convert form data to user data object
                  formData.forEach((value, key) => {
                    if (typeof value === 'string') {
                      (userData as any)[key] = value;
                    }
                  });
                  
                  // Pass the collected data to handleSave
                  handleSave({
                    first_name: userData.first_name || '',
                    last_name: userData.last_name || '',
                    email: userData.email || '',
                    course: userData.course || '',
                    semester: userData.semester || '',
                    notes: userData.notes || ''
                  });
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
