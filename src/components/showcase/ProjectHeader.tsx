
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PrivacyToggle } from '@/components/PrivacyToggle';
import { User, TagIcon } from 'lucide-react';
import { Project, Tag } from '@/types';

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
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {projectTags.map(tag => (
            <div key={tag.id} className="group relative">
              <Badge 
                variant="secondary" 
                className="flex items-center gap-1 px-3 py-1"
              >
                <TagIcon className="h-3 w-3" />
                {tag.name}
              </Badge>
              
              {tag.description && (
                <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-popover text-popover-foreground shadow-md rounded-md px-3 py-2 text-sm max-w-[200px]">
                    {tag.description}
                    <div className="absolute w-2 h-2 bg-popover rotate-45 left-1/2 transform -translate-x-1/2 top-full -mt-1"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-center space-x-3 mb-6">
        <Avatar>
          {creator?.avatar && <AvatarImage src={creator.avatar} />}
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{creator?.name || project.creatorName}</p>
          <p className="text-xs text-muted-foreground">{creator?.role || 'Creator'}</p>
        </div>
        
        {canEdit && (
          <PrivacyToggle 
            isPrivate={project.isPrivate} 
            projectId={project.id}
            onToggle={onTogglePrivacy}
          />
        )}
      </div>
    </motion.div>
  );
}
