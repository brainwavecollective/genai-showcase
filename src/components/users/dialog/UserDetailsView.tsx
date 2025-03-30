import { User, getUserFullName } from '@/types';
import { Label } from '@/components/ui/label';
import UserStatusBadge from '../UserStatusBadge';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { UserCircle, School, CalendarDays, ExternalLink, Mail, GraduationCap, Hash, FileText, Globe, Linkedin, Twitter, Github, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface UserDetailsViewProps {
  user: User;
}

const UserDetailsView = ({ user }: UserDetailsViewProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    return format(new Date(dateString), 'PPP');
  };
  
  // Use the consistent getUserFullName function
  const fullName = getUserFullName(user);

  // Check if user has any social profiles
  const hasSocialProfiles = user.website || user.linkedin || user.twitter || user.github || user.instagram;

  return (
    <div className="grid gap-6 py-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Account Status</h3>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right font-semibold">Status</Label>
          <div className="col-span-3">
            <UserStatusBadge status={user.status || 'pending_review'} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right font-semibold">Email</Label>
          <div className="col-span-3 flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right font-semibold">Name</Label>
          <div className="col-span-3 flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-muted-foreground" />
            {fullName}
            <Button variant="ghost" size="icon" asChild className="h-6 w-6" title="View bio page">
              <Link to={`/user/${user.id}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        {user.bio && (
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right font-semibold">Bio</Label>
            <div className="col-span-3 flex items-start">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
              <div className="whitespace-pre-wrap">{user.bio}</div>
            </div>
          </div>
        )}
      </div>
      
      {hasSocialProfiles && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Social Profiles</h3>
          
          {user.website && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">Website</Label>
              <div className="col-span-3 flex items-center">
                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {user.website}
                </a>
              </div>
            </div>
          )}
          
          {user.linkedin && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">LinkedIn</Label>
              <div className="col-span-3 flex items-center">
                <Linkedin className="h-4 w-4 mr-2 text-muted-foreground" />
                <a 
                  href={user.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            </div>
          )}
          
          {user.twitter && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">Twitter</Label>
              <div className="col-span-3 flex items-center">
                <Twitter className="h-4 w-4 mr-2 text-muted-foreground" />
                <a 
                  href={user.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Twitter Profile
                </a>
              </div>
            </div>
          )}
          
          {user.github && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">GitHub</Label>
              <div className="col-span-3 flex items-center">
                <Github className="h-4 w-4 mr-2 text-muted-foreground" />
                <a 
                  href={user.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub Profile
                </a>
              </div>
            </div>
          )}
          
          {user.instagram && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-semibold">Instagram</Label>
              <div className="col-span-3 flex items-center">
                <Instagram className="h-4 w-4 mr-2 text-muted-foreground" />
                <a 
                  href={user.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Instagram Profile
                </a>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Education</h3>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right font-semibold">Course</Label>
          <div className="col-span-3 flex items-center">
            <School className="h-4 w-4 mr-2 text-muted-foreground" />
            {user.course || 'Not set'}
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right font-semibold">Semester</Label>
          <div className="col-span-3 flex items-center">
            <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
            {user.semester || 'Not set'}
          </div>
        </div>
      </div>
      
      {user.notes && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Admin Notes</h3>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right font-semibold">Notes</Label>
            <div className="col-span-3 whitespace-pre-wrap bg-muted/50 p-2 rounded text-sm">{user.notes}</div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Account Details</h3>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right font-semibold">Role</Label>
          <div className="col-span-3 capitalize flex items-center gap-2">
            {user.role}
            <Badge variant="outline" className="text-xs">{user.role}</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right font-semibold">Created</Label>
          <div className="col-span-3 flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
            {formatDate(user.created_at)}
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right font-semibold">ID</Label>
          <div className="col-span-3 flex items-center">
            <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-xs text-muted-foreground truncate">{user.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsView;
