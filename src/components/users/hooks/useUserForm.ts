
import { useState, ChangeEvent, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { UserFormData, userFormSchema, initialFormData } from '../utils/userFormValidation';

interface UseUserFormProps {
  onSuccess: () => void;
}

export const useUserForm = ({ onSuccess }: UseUserFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addUser = useMutation({
    mutationFn: async (userData: UserFormData) => {
      // Use the secure insert_user RPC function instead of direct insert
      const { data, error } = await supabase
        .rpc('insert_user', {
          p_email: userData.email,
          p_name: `${userData.first_name} ${userData.last_name}`,
          p_role: 'creator', // Default role
          p_first_name: userData.first_name,
          p_last_name: userData.last_name,
          p_course: userData.course || null,
          p_semester: userData.semester || null,
          p_notes: userData.notes || null,
          p_status: userData.status
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate the users query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      toast({
        title: "User Added",
        description: "The user has been added successfully",
      });
      // Reset form
      setFormData(initialFormData);
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      userFormSchema.parse(formData);
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

  return {
    formData,
    errors,
    handleInputChange,
    handleSubmit,
    isSubmitting: addUser.isPending
  };
};
