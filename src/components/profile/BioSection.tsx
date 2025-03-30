import { useState, useEffect } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Edit } from 'lucide-react';

interface BioSectionProps {
  user: User | null;
}

export const BioSection = ({ user }: BioSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [bioData, setBioData] = useState({
    bio: user?.bio || '',
    website: user?.website || '',
    linkedin: user?.linkedin || '',
    twitter: user?.twitter || '',
    github: user?.github || '',
    instagram: user?.instagram || '',
  });

  // Update local state when user prop changes - fixed to useEffect instead of useState
  useEffect(() => {
    if (user) {
      setBioData({
        bio: user.bio || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        github: user.github || '',
        instagram: user.instagram || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBioData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Use the new update_user_bio RPC function instead of direct update
      const { data, error } = await supabase
        .rpc('update_user_bio', {
          p_user_id: user.id,
          p_bio: bioData.bio,
          p_website: bioData.website,
          p_linkedin: bioData.linkedin,
          p_twitter: bioData.twitter,
          p_github: bioData.github,
          p_instagram: bioData.instagram
        });
        
      if (error) throw error;
      
      // Update local state with the returned user data
      if (data && data.length > 0) {
        const updatedUser = data[0];
        // Update user info directly in this component
        setBioData({
          bio: updatedUser.bio || '',
          website: updatedUser.website || '',
          linkedin: updatedUser.linkedin || '',
          twitter: updatedUser.twitter || '',
          github: updatedUser.github || '',
          instagram: updatedUser.instagram || '',
        });
      }
      
      toast({
        title: "Profile updated",
        description: "Your bio and social links have been updated successfully.",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bio & Social Links</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsEditing(!isEditing)}
          disabled={isLoading}
        >
          {isEditing ? 'Cancel' : <Edit className="h-4 w-4 mr-2" />}
          {isEditing ? '' : 'Edit'}
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                name="bio"
                value={bioData.bio} 
                onChange={handleChange}
                placeholder="Tell others about yourself..."
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                name="website"
                value={bioData.website} 
                onChange={handleChange}
                placeholder="https://yourwebsite.com" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input 
                  id="linkedin" 
                  name="linkedin"
                  value={bioData.linkedin} 
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourusername" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input 
                  id="twitter" 
                  name="twitter"
                  value={bioData.twitter} 
                  onChange={handleChange}
                  placeholder="https://twitter.com/yourusername" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input 
                  id="github" 
                  name="github"
                  value={bioData.github} 
                  onChange={handleChange}
                  placeholder="https://github.com/yourusername" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input 
                  id="instagram" 
                  name="instagram"
                  value={bioData.instagram} 
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourusername" 
                />
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Bio</h3>
              <p className="text-sm">
                {bioData.bio || "No bio provided yet."}
              </p>
            </div>
            
            {(bioData.website || bioData.linkedin || bioData.twitter || bioData.github || bioData.instagram) && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Connect</h3>
                <div className="flex flex-wrap gap-2">
                  {bioData.website && (
                    <a 
                      href={bioData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Website
                    </a>
                  )}
                  
                  {bioData.linkedin && (
                    <a 
                      href={bioData.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                  
                  {bioData.twitter && (
                    <a 
                      href={bioData.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Twitter
                    </a>
                  )}
                  
                  {bioData.github && (
                    <a 
                      href={bioData.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  
                  {bioData.instagram && (
                    <a 
                      href={bioData.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
