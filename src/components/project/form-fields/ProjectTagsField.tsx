
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { TagSelector } from '@/components/project/TagSelector';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '../schema/projectFormSchema';

interface ProjectTagsFieldProps {
  form: UseFormReturn<ProjectFormValues>;
}

export function ProjectTagsField({ form }: ProjectTagsFieldProps) {
  return (
    <FormField
      control={form.control}
      name="tag_ids"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormControl>
            <TagSelector
              selectedTags={field.value || []}
              onTagsChange={field.onChange}
            />
          </FormControl>
          <FormDescription>
            Select tags that describe your project.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
