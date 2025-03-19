
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserStatus } from '@/types';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { UserPlus, Loader2 } from 'lucide-react';

interface AddUserFormProps {
  onSuccess: () => void;
}

const AddUserForm = ({ onSuccess }: AddUserFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    course: '',
    semester: '',
    notes: '',
    status: 'pending_review' as UserStatus
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form validation schema
  const formSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    course: z.string().optional(),
    semester: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(['pending_review', 'approved', 'denied']),
  });

  const addUser = useMutation({
    mutationFn: async (userData: typeof formData) => {
      // Create a user in the users table
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            email: userData.email,
            name: `${userData.first_name} ${userData.last_name}`,
            role: 'creator', // Default role
            first_name: userData.first_name,
            last_name: userData.last_name,
            course: userData.course,
            semester: userData.semester,
            notes: userData.notes,
            status: userData.status
          }
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "User Added",
        description: "The user has been added successfully",
      });
      // Reset form
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        course: '',
        semester: '',
        notes: '',
        status: 'pending_review'
      });
      // Call success callback
      onSuccess();
    },
    onError: (error) => {
      console.error('Error adding user:', error);
      toast({
        title: "Error Adding User",
        description: error.message || "An error occurred while adding the user",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      formSchema.parse(formData);
      // If validation passes, submit form
      addUser.mutate(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more usable format
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="user@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>
        
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
            <Input
              id="first_name"
              name="first_name"
              placeholder="First name"
              value={formData.first_name}
              onChange={handleInputChange}
              className={errors.first_name ? "border-red-500" : ""}
            />
            {errors.first_name && <p className="text-xs text-red-500">{errors.first_name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name <span className="text-red-500">*</span></Label>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Last name"
              value={formData.last_name}
              onChange={handleInputChange}
              className={errors.last_name ? "border-red-500" : ""}
            />
            {errors.last_name && <p className="text-xs text-red-500">{errors.last_name}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="course">Course</Label>
          <Input
            id="course"
            name="course"
            placeholder="Course name"
            value={formData.course}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <Input
            id="semester"
            name="semester"
            placeholder="e.g. Fall 2023"
            value={formData.semester}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Additional information about this user..."
            rows={4}
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full md:w-auto"
        disabled={addUser.isPending}
      >
        {addUser.isPending ? (
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
