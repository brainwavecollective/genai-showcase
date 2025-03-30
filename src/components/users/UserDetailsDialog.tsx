
import { useState } from 'react';
import { User, UserStatus } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import UserStatusBadge from './UserStatusBadge';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, Edit, Save, X } from 'lucide-react';

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
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    return format(new Date(dateString), 'PPP');
  };
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Discard changes
      setEditedUser({});
    } else {
      // Initialize edit form with current user data
      setEditedUser({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        course: user.course || '',
        semester: user.semester || '',
        notes: user.notes || ''
      });
      console.log('Initializing edit form with user data:', user);
    }
    setIsEditing(!isEditing);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    if (onUserUpdate) {
      // Log the data being saved for debugging
      console.log('Saving user data:', editedUser);
      onUserUpdate(user.id, editedUser);
    }
    setIsEditing(false);
    setEditedUser({});
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
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold">Status</Label>
            <div className="col-span-3">
              <UserStatusBadge status={user.status || 'pending_review'} />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold" htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                name="email"
                className="col-span-3"
                value={editedUser.email || ''}
                onChange={handleInputChange}
              />
            ) : (
              <div className="col-span-3 truncate">{user.email}</div>
            )}
          </div>
          
          {isEditing ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold" htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  className="col-span-3"
                  value={editedUser.first_name || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold" htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  className="col-span-3"
                  value={editedUser.last_name || ''}
                  onChange={handleInputChange}
                />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">Name</Label>
              <div className="col-span-3">
                {user.first_name && user.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user.name || 'Not set'}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold" htmlFor="course">Course</Label>
            {isEditing ? (
              <Input
                id="course"
                name="course"
                className="col-span-3"
                value={editedUser.course || ''}
                onChange={handleInputChange}
              />
            ) : (
              <div className="col-span-3">{user.course || 'Not set'}</div>
            )}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-semibold" htmlFor="semester">Semester</Label>
            {isEditing ? (
              <Input
                id="semester"
                name="semester"
                className="col-span-3"
                value={editedUser.semester || ''}
                onChange={handleInputChange}
              />
            ) : (
              <div className="col-span-3">{user.semester || 'Not set'}</div>
            )}
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right font-semibold" htmlFor="notes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                name="notes"
                className="col-span-3"
                rows={3}
                value={editedUser.notes || ''}
                onChange={handleInputChange}
              />
            ) : (
              <div className="col-span-3 whitespace-pre-wrap">{user.notes || 'Not set'}</div>
            )}
          </div>
          
          {!isEditing && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Role</Label>
                <div className="col-span-3 capitalize">{user.role}</div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold">Created</Label>
                <div className="col-span-3">{formatDate(user.created_at)}</div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:gap-0">
          {isEditing ? (
            <Button
              onClick={handleSave}
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
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
