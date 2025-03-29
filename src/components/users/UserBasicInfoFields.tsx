
import { ChangeEvent } from 'react';
import FormField from './FormField';
import { UserFormData } from './utils/userFormValidation';

interface UserBasicInfoFieldsProps {
  formData: UserFormData;
  errors: Record<string, string>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const UserBasicInfoFields = ({ formData, errors, onChange }: UserBasicInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="user@example.com"
          value={formData.email}
          onChange={onChange}
          error={errors.email}
          required
        />
      </div>
      
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="First Name"
          name="first_name"
          placeholder="First name"
          value={formData.first_name}
          onChange={onChange}
          error={errors.first_name}
          required
        />
        
        <FormField
          label="Last Name"
          name="last_name"
          placeholder="Last name"
          value={formData.last_name}
          onChange={onChange}
          error={errors.last_name}
          required
        />
      </div>
    </>
  );
};

export default UserBasicInfoFields;
