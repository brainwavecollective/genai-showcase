
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Link2, Globe, Linkedin, Twitter, Github, Instagram } from 'lucide-react';

interface BioSectionProps {
  user: User | null;
  isFieldVisible: (field: string) => boolean;
}

export function BioSection({ user, isFieldVisible }: BioSectionProps) {
  if (!user) return null;
  
  const hasLinks = (
    (isFieldVisible('website') && !!user.website) ||
    (isFieldVisible('linkedin') && !!user.linkedin) ||
    (isFieldVisible('twitter') && !!user.twitter) ||
    (isFieldVisible('github') && !!user.github) ||
    (isFieldVisible('instagram') && !!user.instagram)
  );
  
  // Only show this component if there's a bio or social links to display
  if (!hasLinks && (!user.bio || !isFieldVisible('bio'))) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isFieldVisible('bio') && user.bio && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">About</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{user.bio}</p>
          </div>
        )}
        
        {hasLinks && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {isFieldVisible('website') && user.website && (
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  Website
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
              
              {isFieldVisible('linkedin') && user.linkedin && (
                <a 
                  href={user.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  <Linkedin className="h-4 w-4 mr-1" />
                  LinkedIn
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
              
              {isFieldVisible('twitter') && user.twitter && (
                <a 
                  href={user.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  <Twitter className="h-4 w-4 mr-1" />
                  Twitter
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
              
              {isFieldVisible('github') && user.github && (
                <a 
                  href={user.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  <Github className="h-4 w-4 mr-1" />
                  GitHub
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
              
              {isFieldVisible('instagram') && user.instagram && (
                <a 
                  href={user.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  <Instagram className="h-4 w-4 mr-1" />
                  Instagram
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
