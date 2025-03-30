
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '../schema/projectFormSchema';

interface ProjectTitleFieldProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function ProjectTitleField({ form }: ProjectTitleFieldProps) {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project Title</FormLabel>
          <FormControl>
            <Input placeholder="Enter project title" {...field} />
          </FormControl>
          <FormDescription>
            Choose a clear, descriptive title for your project.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
