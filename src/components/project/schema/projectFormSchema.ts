
import { z } from 'zod';

export const projectFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters."
  }),
  description: z.string().max(500, {
    message: "Description must not exceed 500 characters."
  }).optional(),
  is_private: z.boolean().default(false),
  tag_ids: z.array(z.string()).optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
