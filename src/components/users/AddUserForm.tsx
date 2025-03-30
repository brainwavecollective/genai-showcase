
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2, X } from 'lucide-react';
import UserBasicInfoFields from './UserBasicInfoFields';
import UserEducationFields from './UserEducationFields';
import { useUserForm } from './hooks/useUserForm';

interface AddUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddUserForm = ({ onSuccess, onCancel }: AddUserFormProps) => {
  const { 
    formData, 
    errors, 
    handleInputChange, 
    handleSubmit, 
    isSubmitting 
  } = useUserForm({ onSuccess });

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <UserBasicInfoFields 
          formData={formData} 
          errors={errors} 
          onChange={handleInputChange} 
        />
        
        {/* Educational Information */}
        <UserEducationFields 
          formData={formData} 
          onChange={handleInputChange} 
        />
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          type="submit" 
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding User...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </>
          )}
        </Button>
        
        <Button 
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full md:w-auto"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>
    </motion.form>
  );
};

export default AddUserForm;
