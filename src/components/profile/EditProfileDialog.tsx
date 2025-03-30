
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
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { PrivacyToggleField } from '@/components/project/PrivacyToggleField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  mode: 'private' | 'public';
  onClose: () => void;
}

export function EditProfileDialog({ user, isOpen, onClose }: EditProfileDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Default privacy settings (can be updated from user data when available)
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    is_last_name_public: false,
    is_avatar_public: true,
    is_bio_public: true,
    is_email_public: false,
    is_website_public: true,
    is_linkedin_public: true,
    is_twitter_public: true,
    is_github_public: true,
    is_instagram_public: true,
  });

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

  const handlePrivacyToggle = (field: keyof PrivacySettings) => (isPublic: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [field]: isPublic,
    }));
  };

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
          // Add privacy settings
          is_last_name_public: privacySettings.is_last_name_public,
          is_avatar_public: privacySettings.is_avatar_public,
        })
        .eq('id', user.id);

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

  async function onSubmitPublic(values: PublicBioFormValues) {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Create an object with all the values we want to update
      const updateData = {
        bio: values.bio || '',
        email: values.email || user.email,
        website: values.website || '',
        linkedin: values.linkedin || '',
        twitter: values.twitter || '',
        github: values.github || '',
        instagram: values.instagram || '',
        // Add privacy settings
        is_bio_public: privacySettings.is_bio_public,
        is_email_public: privacySettings.is_email_public,
        is_website_public: privacySettings.is_website_public,
        is_linkedin_public: privacySettings.is_linkedin_public,
        is_twitter_public: privacySettings.is_twitter_public,
        is_github_public: privacySettings.is_github_public,
        is_instagram_public: privacySettings.is_instagram_public,
      };

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['user', user.id] });
      
      toast({
        title: "Bio updated",
        description: "Your public bio and privacy settings have been updated successfully.",
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and privacy settings below.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="links">Bio & Links</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 py-4">
            <Form {...privateForm}>
              <form onSubmit={privateForm.handleSubmit(onSubmitPrivate)} className="space-y-4">
                <FormField
                  control={privateForm.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name <span className="text-xs text-muted-foreground">(Always public)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-4 items-start">
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
                  
                  <PrivacyToggleField
                    label="Last Name Visibility"
                    isPublic={privacySettings.is_last_name_public}
                    onChange={handlePrivacyToggle('is_last_name_public')}
                  />
                </div>
                
                <PrivacyToggleField
                  label="Profile Photo Visibility"
                  isPublic={privacySettings.is_avatar_public}
                  onChange={handlePrivacyToggle('is_avatar_public')}
                />
                
                <Separator className="my-4" />
                
                <FormField
                  control={privateForm.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course <span className="text-xs text-muted-foreground">(Private info)</span></FormLabel>
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
                      <FormLabel>Semester <span className="text-xs text-muted-foreground">(Private info)</span></FormLabel>
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
          </TabsContent>
          
          <TabsContent value="links" className="space-y-4 py-4">
            <Form {...publicForm}>
              <form onSubmit={publicForm.handleSubmit(onSubmitPublic)} className="space-y-4">
                <div className="grid gap-4 items-start">
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
                  
                  <PrivacyToggleField
                    label="Bio Visibility"
                    isPublic={privacySettings.is_bio_public}
                    onChange={handlePrivacyToggle('is_bio_public')}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Contact & Social Links</h3>
                  
                  <div className="grid gap-4 items-start">
                    <FormField
                      control={publicForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <PrivacyToggleField
                      label="Email Visibility"
                      isPublic={privacySettings.is_email_public}
                      onChange={handlePrivacyToggle('is_email_public')}
                    />
                  </div>
                  
                  <div className="grid gap-4 items-start">
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
                    
                    <PrivacyToggleField
                      label="Website Visibility"
                      isPublic={privacySettings.is_website_public}
                      onChange={handlePrivacyToggle('is_website_public')}
                    />
                  </div>
                  
                  <div className="grid gap-4 items-start">
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
                    
                    <PrivacyToggleField
                      label="LinkedIn Visibility"
                      isPublic={privacySettings.is_linkedin_public}
                      onChange={handlePrivacyToggle('is_linkedin_public')}
                    />
                  </div>
                  
                  <div className="grid gap-4 items-start">
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
                    
                    <PrivacyToggleField
                      label="Twitter Visibility"
                      isPublic={privacySettings.is_twitter_public}
                      onChange={handlePrivacyToggle('is_twitter_public')}
                    />
                  </div>
                  
                  <div className="grid gap-4 items-start">
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
                    
                    <PrivacyToggleField
                      label="GitHub Visibility"
                      isPublic={privacySettings.is_github_public}
                      onChange={handlePrivacyToggle('is_github_public')}
                    />
                  </div>
                  
                  <div className="grid gap-4 items-start">
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
                    
                    <PrivacyToggleField
                      label="Instagram Visibility"
                      isPublic={privacySettings.is_instagram_public}
                      onChange={handlePrivacyToggle('is_instagram_public')}
                    />
                  </div>
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
