
import { ChangeEvent } from 'react';
import FormField from './FormField';
import { UserFormData } from './utils/userFormValidation';

interface UserEducationFieldsProps {
  formData: UserFormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const UserEducationFields = ({ formData, onChange }: UserEducationFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <FormField
          label="Course"
          name="course"
          placeholder="Course name"
          value={formData.course}
          onChange={onChange}
        />
      </div>
      
      <div className="space-y-2">
        <FormField
          label="Semester"
          name="semester"
          placeholder="e.g. Fall 2023"
          value={formData.semester}
          onChange={onChange}
        />
      </div>
      
      <div className="md:col-span-2 space-y-2">
        <FormField
          label="Notes"
          name="notes"
          placeholder="Additional information about this user..."
          value={formData.notes}
          onChange={onChange}
          as="textarea"
          rows={4}
        />
      </div>
    </>
  );
};

export default UserEducationFields;
