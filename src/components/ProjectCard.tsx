import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project, Tag, getUserFullName } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Lock, Tag as TagIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ProjectCardProps {
  project: Project;
  tags?: Tag[];
}

export function ProjectCard({ project, tags = [] }: ProjectCardProps) {
  const { isAuthenticated } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const isPrivate = project.is_private;
  
  console.log("Rendering ProjectCard for:", project.title, "with ID:", project.id);
  
  // Format date
  const formattedDate = new Date(project.updated_at || '').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  // Handle image loading
  useEffect(() => {
    if (project.cover_image_url) {
      const img = new Image();
      img.src = project.cover_image_url;
      img.onload = () => setImageLoaded(true);
    } else {
      setImageLoaded(true);
    }
  }, [project.cover_image_url]);

  // Filter to only show tags that exist in the tags array
  const displayTags = project.tag_ids
    ? project.tag_ids
        .map(tagId => tags.find(tag => tag.id === tagId))
        .filter(tag => tag !== undefined) as Tag[]
    : [];

  // Format creator name using getUserFullName if creator_name is coming from a User object
  // otherwise, use the creator_name directly or fall back to 'Unknown Creator'
  const creatorName = project.creator_name || 'Unknown Creator';

  return (
    <Link to={`/project/${project.id}`}>
      <Card className="overflow-hidden hover-lift group h-full">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {project.cover_image_url ? (
            <>
              <div 
                className={`absolute inset-0 bg-muted ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              />
              <img
                src={project.cover_image_url}
                alt={project.title}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50" />
          )}
          
          {isPrivate && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-background/60 backdrop-blur-sm">
                <Lock className="h-3 w-3 mr-1" />
                Private
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="pt-4">
          <h3 className="text-lg font-medium line-clamp-2">{project.title}</h3>
          
          {(isAuthenticated || !isPrivate) && project.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
              {project.description}
            </p>
          )}
          
          {!isAuthenticated && isPrivate && (
            <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" />
              <span>Sign in to view details</span>
            </p>
          )}

          {(isAuthenticated || !isPrivate) && displayTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {displayTags.map(tag => (
                <TooltipProvider key={tag.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        <TagIcon className="h-3 w-3" />
                        {tag.name}
                      </Badge>
                    </TooltipTrigger>
                    {tag.description && tag.description !== 'Admin created tag' && tag.description !== 'User created tag' && (
                      <TooltipContent className="max-w-[200px]">
                        <p>{tag.description}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 pb-4 flex justify-between">
          <div className="text-sm text-muted-foreground">
            By {creatorName}
          </div>
          
          <div className="text-xs text-muted-foreground flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formattedDate}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
