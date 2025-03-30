
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Link2, Globe, Linkedin, Twitter, Github, Instagram, Mail, Calendar, Clock, Hash, GraduationCap, School } from 'lucide-react';
import { format } from 'date-fns';

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
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'n/a';
    return format(new Date(dateString), 'MMMM dd, yyyy');
  };
  
  // Only show this component if there's any information to display
  if (!hasLinks && 
      !isFieldVisible('bio') && 
      !isFieldVisible('email') && 
      !(user.course && isFieldVisible('course')) && 
      !(user.semester && isFieldVisible('semester'))) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isFieldVisible('bio') && user.bio && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">About</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{user.bio}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            {isFieldVisible('email') && user.email && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Contact</h3>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
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
          </div>

          {/* Education & Account Information */}
          <div className="space-y-4">
            {(user.course || user.semester) && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Education</h3>
                {user.course && (
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span>Course: {user.course}</span>
                  </div>
                )}
                {user.semester && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>Semester: {user.semester}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Account</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined: {formatDate(user.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Updated: {formatDate(user.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
