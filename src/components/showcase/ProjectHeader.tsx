
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PrivacyToggle } from '@/components/PrivacyToggle';
import { User, TagIcon } from 'lucide-react';
import { Project, Tag } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ProjectHeaderProps {
  project: Project;
  creator: any;
  canEdit: boolean;
  projectTags: Tag[];
  onTogglePrivacy: (isPrivate: boolean) => void;
}

export function ProjectHeader({
  project,
  creator,
  canEdit,
  projectTags,
  onTogglePrivacy
}: ProjectHeaderProps) {
  const [openTags, setOpenTags] = useState<string[]>([]);

  const toggleTag = (tagId: string) => {
    setOpenTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-10"
    >
      <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">{project.title}</h1>
      
      {project.description && (
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">{project.description}</p>
      )}
      
      {/* Display project tags with descriptions */}
      {projectTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {projectTags.map(tag => (
            <div key={tag.id} className="w-auto max-w-56">
              <Collapsible 
                open={openTags.includes(tag.id)}
                onOpenChange={() => toggleTag(tag.id)}
                className="w-full bg-secondary rounded-md overflow-hidden"
              >
                <CollapsibleTrigger className="w-full">
                  <Badge 
                    variant="secondary" 
                    className="flex items-center gap-1 px-3 py-1.5 w-full justify-center cursor-pointer"
                  >
                    <TagIcon className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{tag.name}</span>
                  </Badge>
                </CollapsibleTrigger>
                
                {tag.description && (
                  <CollapsibleContent>
                    <div className="p-3 text-sm text-left text-muted-foreground">
                      {tag.description}
                    </div>
                  </CollapsibleContent>
                )}
              </Collapsible>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-center space-x-3 mb-6">
        {creator?.id ? (
          <Link to={`/user/${creator.id}`} className="flex items-center space-x-3">
            <Avatar>
              {creator?.avatar_url && <AvatarImage src={creator.avatar_url} />}
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium hover:underline">
                {creator?.name || project.creator_name}
              </p>
              <p className="text-xs text-muted-foreground">{creator?.role || 'Creator'}</p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{creator?.name || project.creator_name}</p>
              <p className="text-xs text-muted-foreground">{creator?.role || 'Creator'}</p>
            </div>
          </div>
        )}
        
        {canEdit && (
          <PrivacyToggle 
            isPrivate={project.is_private} 
            projectId={project.id}
            onToggle={onTogglePrivacy}
          />
        )}
      </div>
    </motion.div>
  );
}
