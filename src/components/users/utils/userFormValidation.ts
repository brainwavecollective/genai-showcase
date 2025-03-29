
import { z } from 'zod';
import { UserStatus } from '@/types';

// Form validation schema
export const userFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  course: z.string().optional(),
  semester: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['pending_review', 'approved', 'denied']),
});

export type UserFormData = z.infer<typeof userFormSchema>;

// Initial form data
export const initialFormData: UserFormData = {
  email: '',
  first_name: '',
  last_name: '',
  course: '',
  semester: '',
  notes: '',
  status: 'pending_review' as UserStatus
};
