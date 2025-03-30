import { User, getUserFullName } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink, Mail, Globe, Linkedin, Twitter, Github, Instagram } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PublicBioCardProps {
  user: User;
}

export const PublicBioCard = ({ user }: PublicBioCardProps) => {
  // Use getUserFullName to ensure consistency
  const fullName = getUserFullName(user);
  const initials = fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={user.avatar_url || ''} alt={fullName} />
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl font-bold">{fullName}</CardTitle>
        <div className="flex items-center justify-center mt-2 text-muted-foreground">
          <Mail className="h-4 w-4 mr-2" />
          <span>{user.email}</span>
        </div>
        {user.role && (
          <Badge variant="outline" className="mt-2">
            {user.role}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {user.bio && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">About</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{user.bio}</p>
          </div>
        )}

        {(user.website || user.linkedin || user.twitter || user.github || user.instagram) && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {user.website && (
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
              
              {user.linkedin && (
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
              
              {user.twitter && (
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
              
              {user.github && (
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
              
              {user.instagram && (
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

        {(user.course || user.semester) && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Education</h3>
            <div className="text-muted-foreground">
              {user.course && <p>Course: {user.course}</p>}
              {user.semester && <p>Semester: {user.semester}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
