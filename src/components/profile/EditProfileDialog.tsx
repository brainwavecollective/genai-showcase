
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, getUserFullName } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const privateProfileFormSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  course: z.string().optional(),
  semester: z.string().optional(),
});

const publicBioFormSchema = z.object({
  bio: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  website: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  linkedin: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  twitter: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  github: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  instagram: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
});

type PrivateProfileFormValues = z.infer<typeof privateProfileFormSchema>;
type PublicBioFormValues = z.infer<typeof publicBioFormSchema>;

interface EditProfileDialogProps {
  user: User | null;
  isOpen: boolean;
  mode: 'private' | 'public';
  onClose: () => void;
}

export function EditProfileDialog({ user, isOpen, mode, onClose }: EditProfileDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const privateForm = useForm<PrivateProfileFormValues>({
    resolver: zodResolver(privateProfileFormSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      course: user?.course || '',
      semester: user?.semester || '',
    },
  });

  const publicForm = useForm<PublicBioFormValues>({
    resolver: zodResolver(publicBioFormSchema),
    defaultValues: {
      bio: user?.bio || '',
      email: user?.email || '',
      website: user?.website || '',
      linkedin: user?.linkedin || '',
      twitter: user?.twitter || '',
      github: user?.github || '',
      instagram: user?.instagram || '',
    },
  });

  async function onSubmitPrivate(values: PrivateProfileFormValues) {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          course: values.course,
          semester: values.semester,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['user', user.id] });
      
      toast({
        title: "Profile updated",
        description: "Your private profile has been updated successfully.",
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmitPublic(values: PublicBioFormValues) {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.rpc('update_user_bio', {
        p_user_id: user.id,
        p_bio: values.bio || '',
        p_email: values.email || user.email,
        p_website: values.website || '',
        p_linkedin: values.linkedin || '',
        p_twitter: values.twitter || '',
        p_github: values.github || '',
        p_instagram: values.instagram || '',
      });

      if (error) throw error;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['user', user.id] });
      
      toast({
        title: "Bio updated",
        description: "Your public bio has been updated successfully.",
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating bio:', error);
      toast({
        title: "Error",
        description: "Failed to update bio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'private' ? 'Edit Private Profile' : 'Edit Public Bio'}</DialogTitle>
          <DialogDescription>
            {mode === 'private' 
              ? 'Update your private profile information below.'
              : 'Update your public bio and social links.'}
          </DialogDescription>
        </DialogHeader>
        
        {mode === 'private' ? (
          <Form {...privateForm}>
            <form onSubmit={privateForm.handleSubmit(onSubmitPrivate)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={privateForm.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={privateForm.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={privateForm.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Course" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={privateForm.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <FormControl>
                      <Input placeholder="Current Semester" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...publicForm}>
            <form onSubmit={publicForm.handleSubmit(onSubmitPublic)} className="space-y-4">
              <FormField
                control={publicForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about yourself" 
                        className="resize-y min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={publicForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Public Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={publicForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourwebsite.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={publicForm.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={publicForm.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={publicForm.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={publicForm.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
