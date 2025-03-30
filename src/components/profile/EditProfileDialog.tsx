
import { useState, useEffect } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { PrivacyToggleField } from '@/components/project/PrivacyToggleField';

const profileFormSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  course: z.string().optional(),
  semester: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  website: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  linkedin: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  twitter: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  github: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  instagram: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface PrivacySettings {
  is_last_name_public: boolean;
  is_avatar_public: boolean;
  is_bio_public: boolean;
  is_email_public: boolean;
  is_website_public: boolean;
  is_linkedin_public: boolean;
  is_twitter_public: boolean;
  is_github_public: boolean;
  is_instagram_public: boolean;
}

interface EditProfileDialogProps {
  user: User | null;
  isOpen: boolean;
  mode: 'all'; // Keeping the prop for compatibility, but we only support 'all' now
  onClose: () => void;
}

export function EditProfileDialog({ user, isOpen, onClose }: EditProfileDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Default privacy settings (updated from user data when available)
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    is_last_name_public: user?.is_last_name_public || false,
    is_avatar_public: user?.is_avatar_public !== false, // Default to true
    is_bio_public: user?.is_bio_public !== false, // Default to true
    is_email_public: user?.is_email_public || false,
    is_website_public: user?.is_website_public !== false, // Default to true
    is_linkedin_public: user?.is_linkedin_public !== false, // Default to true
    is_twitter_public: user?.is_twitter_public !== false, // Default to true
    is_github_public: user?.is_github_public !== false, // Default to true
    is_instagram_public: user?.is_instagram_public !== false, // Default to true
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      course: user?.course || '',
      semester: user?.semester || '',
      bio: user?.bio || '',
      email: user?.email || '',
      website: user?.website || '',
      linkedin: user?.linkedin || '',
      twitter: user?.twitter || '',
      github: user?.github || '',
      instagram: user?.instagram || '',
    },
  });

  // Update form and privacy settings when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        course: user.course || '',
        semester: user.semester || '',
        bio: user.bio || '',
        email: user.email || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        github: user.github || '',
        instagram: user.instagram || '',
      });

      setPrivacySettings({
        is_last_name_public: user.is_last_name_public || false,
        is_avatar_public: user.is_avatar_public !== false,
        is_bio_public: user.is_bio_public !== false,
        is_email_public: user.is_email_public || false,
        is_website_public: user.is_website_public !== false,
        is_linkedin_public: user.is_linkedin_public !== false,
        is_twitter_public: user.is_twitter_public !== false,
        is_github_public: user.is_github_public !== false,
        is_instagram_public: user.is_instagram_public !== false,
      });
    }
  }, [user, form]);

  const handlePrivacyToggle = (field: keyof PrivacySettings) => (isPublic: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [field]: isPublic,
    }));
  };

  async function onSubmit(values: ProfileFormValues) {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Create an object with all the values we want to update
      const updateData = {
        first_name: values.first_name || '',
        last_name: values.last_name || '',
        course: values.course || '',
        semester: values.semester || '',
        bio: values.bio || '',
        email: values.email || user.email,
        website: values.website || '',
        linkedin: values.linkedin || '',
        twitter: values.twitter || '',
        github: values.github || '',
        instagram: values.instagram || '',
        // Add privacy settings
        is_last_name_public: privacySettings.is_last_name_public,
        is_avatar_public: privacySettings.is_avatar_public,
        is_bio_public: privacySettings.is_bio_public,
        is_email_public: privacySettings.is_email_public,
        is_website_public: privacySettings.is_website_public,
        is_linkedin_public: privacySettings.is_linkedin_public,
        is_twitter_public: privacySettings.is_twitter_public,
        is_github_public: privacySettings.is_github_public,
        is_instagram_public: privacySettings.is_instagram_public,
        updated_at: new Date().toISOString(),
      };

      // Use RPC function instead of direct update to bypass RLS policies
      const { error } = await supabase
        .rpc('update_user_bio', {
          p_user_id: user.id,
          p_first_name: values.first_name || '',
          p_last_name: values.last_name || '',
          p_course: values.course || '',
          p_semester: values.semester || '',
          p_bio: values.bio || '',
          p_email: values.email || user.email,
          p_website: values.website || '',
          p_linkedin: values.linkedin || '',
          p_twitter: values.twitter || '',
          p_github: values.github || '',
          p_instagram: values.instagram || '',
          p_is_last_name_public: privacySettings.is_last_name_public,
          p_is_avatar_public: privacySettings.is_avatar_public,
          p_is_bio_public: privacySettings.is_bio_public,
          p_is_email_public: privacySettings.is_email_public,
          p_is_website_public: privacySettings.is_website_public,
          p_is_linkedin_public: privacySettings.is_linkedin_public,
          p_is_twitter_public: privacySettings.is_twitter_public,
          p_is_github_public: privacySettings.is_github_public,
          p_is_instagram_public: privacySettings.is_instagram_public
        });

      if (error) throw error;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['user', user.id] });
      
      toast({
        title: "Profile updated",
        description: "Your profile and privacy settings have been updated successfully.",
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and privacy settings below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>
              
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>First Name <span className="text-xs text-muted-foreground">(Always public)</span></FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Last Name</FormLabel>
                      <PrivacyToggleField
                        isPublic={privacySettings.is_last_name_public}
                        onChange={handlePrivacyToggle('is_last_name_public')}
                      />
                    </div>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <FormLabel>Profile Photo</FormLabel>
                <PrivacyToggleField
                  isPublic={privacySettings.is_avatar_public}
                  onChange={handlePrivacyToggle('is_avatar_public')}
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Education Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Education</h3>
              
              <FormField
                control={form.control}
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
                control={form.control}
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
            </div>
            
            <Separator />
            
            {/* About/Bio Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">About</h3>
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Bio</FormLabel>
                      <PrivacyToggleField
                        isPublic={privacySettings.is_bio_public}
                        onChange={handlePrivacyToggle('is_bio_public')}
                      />
                    </div>
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
            </div>
            
            <Separator />
            
            {/* Contact & Social Links Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact & Social Links</h3>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Email</FormLabel>
                      <PrivacyToggleField
                        isPublic={privacySettings.is_email_public}
                        onChange={handlePrivacyToggle('is_email_public')}
                      />
                    </div>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Website</FormLabel>
                      <PrivacyToggleField
                        isPublic={privacySettings.is_website_public}
                        onChange={handlePrivacyToggle('is_website_public')}
                      />
                    </div>
                    <FormControl>
                      <Input placeholder="https://yourwebsite.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>LinkedIn</FormLabel>
                      <PrivacyToggleField
                        isPublic={privacySettings.is_linkedin_public}
                        onChange={handlePrivacyToggle('is_linkedin_public')}
                      />
                    </div>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Twitter</FormLabel>
                      <PrivacyToggleField
                        isPublic={privacySettings.is_twitter_public}
                        onChange={handlePrivacyToggle('is_twitter_public')}
                      />
                    </div>
                    <FormControl>
                      <Input placeholder="https://twitter.com/yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>GitHub</FormLabel>
                      <PrivacyToggleField
                        isPublic={privacySettings.is_github_public}
                        onChange={handlePrivacyToggle('is_github_public')}
                      />
                    </div>
                    <FormControl>
                      <Input placeholder="https://github.com/yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Instagram</FormLabel>
                      <PrivacyToggleField
                        isPublic={privacySettings.is_instagram_public}
                        onChange={handlePrivacyToggle('is_instagram_public')}
                      />
                    </div>
                    <FormControl>
                      <Input placeholder="https://instagram.com/yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
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
      </DialogContent>
    </Dialog>
  );
}
