
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, FileText, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BioSectionProps {
  user: User | null;
  isFieldVisible: (field: string) => boolean;
}

export function BioSection({ user, isFieldVisible }: BioSectionProps) {
  if (!user) return null;
  
  const hasBio = !!user.bio;
  const hasLinks = (
    (isFieldVisible('website') && !!user.website) ||
    (isFieldVisible('linkedin') && !!user.linkedin) ||
    (isFieldVisible('twitter') && !!user.twitter) ||
    (isFieldVisible('github') && !!user.github) ||
    (isFieldVisible('instagram') && !!user.instagram)
  );
  
  if (!hasBio && !hasLinks) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Bio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasBio && (
          <div className="space-y-2">
            <p className="whitespace-pre-wrap text-pretty">{user.bio}</p>
          </div>
        )}
        
        {hasLinks && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isFieldVisible('website') && user.website && (
              <div className="flex items-center">
                <Link2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  Website
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
            
            {isFieldVisible('linkedin') && user.linkedin && (
              <div className="flex items-center">
                <Link2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <a 
                  href={user.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  LinkedIn
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
            
            {isFieldVisible('twitter') && user.twitter && (
              <div className="flex items-center">
                <Link2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <a 
                  href={user.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  Twitter
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
            
            {isFieldVisible('github') && user.github && (
              <div className="flex items-center">
                <Link2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <a 
                  href={user.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  GitHub
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
            
            {isFieldVisible('instagram') && user.instagram && (
              <div className="flex items-center">
                <Link2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <a 
                  href={user.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  Instagram
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
