
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { PrivacyToggleField } from '@/components/project/PrivacyToggleField';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '../schema/projectFormSchema';

interface ProjectPrivacyFieldProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function ProjectPrivacyField({ form }: ProjectPrivacyFieldProps) {
  return (
    <FormField
      control={form.control}
      name="is_private"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <PrivacyToggleField
              label="Project Visibility"
              description="Control who can see your project"
              isPublic={!field.value}
              onChange={(isPublic) => field.onChange(!isPublic)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
