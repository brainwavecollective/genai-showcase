
import { User } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import UserStatusBadge from '../UserStatusBadge';
import { useState, useEffect, FormEvent } from 'react';

interface UserDetailsFormProps {
  user: User;
  onSave: (userData: Partial<User>) => void;
  onCancel: () => void;
}

const UserDetailsForm = ({ user, onSave, onCancel }: UserDetailsFormProps) => {
  const [editedUser, setEditedUser] = useState<Partial<User>>(() => {
    return {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      course: user.course || '',
      semester: user.semester || '',
      notes: user.notes || ''
    };
  });
  
  // Re-initialize form when user changes
  useEffect(() => {
    setEditedUser({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
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
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Saving user data:', editedUser);
    onSave(editedUser);
  };

  return (
    <form onSubmit={handleSubmit}>
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
    </form>
  );
};

export default UserDetailsForm;
