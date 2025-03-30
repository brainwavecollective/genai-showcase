
import { useProjectForm } from './hooks/useProjectForm';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectTitleField } from './form-fields/ProjectTitleField';
import { ProjectDescriptionField } from './form-fields/ProjectDescriptionField';
import { ProjectTagsField } from './form-fields/ProjectTagsField';
import { ProjectPrivacyField } from './form-fields/ProjectPrivacyField';
import { SubmitButton } from './form-fields/SubmitButton';

export function NewProjectForm() {
  const { form, isSubmitting, onSubmit } = useProjectForm();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>
          Start a new project to showcase your work. You can add media items after creating the project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ProjectTitleField form={form} />
            <ProjectDescriptionField form={form} />
            <ProjectTagsField form={form} />
            <ProjectPrivacyField form={form} />
            
            <CardFooter className="flex justify-end px-0 pt-4">
              <SubmitButton isSubmitting={isSubmitting} />
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
