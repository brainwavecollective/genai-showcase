
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2 } from 'lucide-react';
import UserBasicInfoFields from './UserBasicInfoFields';
import UserEducationFields from './UserEducationFields';
import { useUserForm } from './hooks/useUserForm';

interface AddUserFormProps {
  onSuccess: () => void;
}

const AddUserForm = ({ onSuccess }: AddUserFormProps) => {
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
    </motion.form>
  );
};

export default AddUserForm;
