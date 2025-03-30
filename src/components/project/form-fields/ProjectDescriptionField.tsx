
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '../schema/projectFormSchema';

interface ProjectDescriptionFieldProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function ProjectDescriptionField({ form }: ProjectDescriptionFieldProps) {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Describe your project (optional)" 
              className="resize-y min-h-[100px]"
              {...field} 
            />
          </FormControl>
          <FormDescription>
            Provide a brief description of your project.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
