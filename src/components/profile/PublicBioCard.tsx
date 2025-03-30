
import { User, getUserFullName } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Link, Linkedin, Twitter, Github, Instagram } from 'lucide-react';

interface PublicBioCardProps {
  user: User | null;
}

export const PublicBioCard = ({ user }: PublicBioCardProps) => {
  if (!user) return null;

  const getInitials = () => {
    const fullName = getUserFullName(user);
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar_url || ''} alt={getUserFullName(user)} />
          <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold">{getUserFullName(user)}</h2>
          <p className="text-muted-foreground">{user.role && <Badge className="capitalize">{user.role}</Badge>}</p>
          <p className="text-muted-foreground mt-2">{user.course}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {user.bio && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">About</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{user.bio}</p>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Contact & Social</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.email && (
              <a href={`mailto:${user.email}`} className="flex items-center gap-2 text-primary hover:underline">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </a>
            )}
            
            {user.website && (
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                <Link className="h-4 w-4" />
                <span>Website</span>
              </a>
            )}
            
            {user.linkedin && (
              <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
            )}
            
            {user.twitter && (
              <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </a>
            )}
            
            {user.github && (
              <a href={user.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            )}
            
            {user.instagram && (
              <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
