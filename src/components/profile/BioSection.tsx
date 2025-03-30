
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Link2 } from 'lucide-react';

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
  
  // We won't show this component anymore since we've integrated the bio information
  // into the main ProfileDetails component
  return null;
}
