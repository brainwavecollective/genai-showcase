
import { User } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import UserStatusBadge from '../UserStatusBadge';
import { useState, useEffect } from 'react';

interface UserDetailsFormProps {
  user: User;
  onSave: (userData: Partial<User>) => void;
  onCancel: () => void;
}

const UserDetailsForm = ({ user, onSave, onCancel }: UserDetailsFormProps) => {
  // Helper function to split full name into first and last name
  const getNameParts = (fullName: string) => {
    const parts = fullName.split(' ');
    if (parts.length === 1) return { firstName: parts[0], lastName: '' };
    const lastName = parts.pop() || '';
    const firstName = parts.join(' ');
    return { firstName, lastName };
  };

  const [editedUser, setEditedUser] = useState<Partial<User>>(() => {
    // If first_name and last_name are empty but name exists, split the name
    let firstName = user.first_name || '';
    let lastName = user.last_name || '';
    
    if ((!firstName || !lastName) && user.name) {
      const nameParts = getNameParts(user.name);
      firstName = firstName || nameParts.firstName;
      lastName = lastName || nameParts.lastName;
    }
    
    return {
      first_name: firstName,
      last_name: lastName,
      email: user.email || '',
      course: user.course || '',
      semester: user.semester || '',
      notes: user.notes || ''
    };
  });
  
  // Re-initialize form when user changes
  useEffect(() => {
    let firstName = user.first_name || '';
    let lastName = user.last_name || '';
    
    if ((!firstName || !lastName) && user.name) {
      const nameParts = getNameParts(user.name);
      firstName = firstName || nameParts.firstName;
      lastName = lastName || nameParts.lastName;
    }
    
    setEditedUser({
      first_name: firstName,
      last_name: lastName,
      email: user.email || '',
      course: user.course || '',
      semester: user.semester || '',
      notes: user.notes || ''
    });
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    // Calculate the full name from first and last name for consistency
    const userData = {
      ...editedUser,
      name: `${editedUser.first_name} ${editedUser.last_name}`.trim()
    };
    
    console.log('Saving user data:', userData);
    onSave(userData);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold">Status</Label>
        <div className="col-span-3">
          <UserStatusBadge status={user.status || 'pending_review'} />
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold" htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          className="col-span-3"
          value={editedUser.email || ''}
          onChange={handleInputChange}
        />
      </div>
      
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
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold" htmlFor="course">Course</Label>
        <Input
          id="course"
          name="course"
          className="col-span-3"
          value={editedUser.course || ''}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right font-semibold" htmlFor="semester">Semester</Label>
        <Input
          id="semester"
          name="semester"
          className="col-span-3"
          value={editedUser.semester || ''}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right font-semibold" htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          className="col-span-3"
          rows={3}
          value={editedUser.notes || ''}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default UserDetailsForm;
