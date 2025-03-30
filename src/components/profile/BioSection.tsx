import { useState } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBioData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Use Supabase's `from('users')` function to update the user's bio and social links
      const { error } = await supabase
        .from('users')
        .update({
          bio: bioData.bio,
          website: bioData.website,
          linkedin: bioData.linkedin,
          twitter: bioData.twitter,
          github: bioData.github,
          instagram: bioData.instagram,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
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
                {user?.bio || "No bio provided yet."}
              </p>
            </div>
            
            {(user?.website || user?.linkedin || user?.twitter || user?.github || user?.instagram) && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Connect</h3>
                <div className="flex flex-wrap gap-2">
                  {user?.website && (
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Website
                    </a>
                  )}
                  
                  {user?.linkedin && (
                    <a 
                      href={user.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                  
                  {user?.twitter && (
                    <a 
                      href={user.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Twitter
                    </a>
                  )}
                  
                  {user?.github && (
                    <a 
                      href={user.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  
                  {user?.instagram && (
                    <a 
                      href={user.instagram} 
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
