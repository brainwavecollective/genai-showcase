
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project, Tag } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Lock, Tag as TagIcon } from 'lucide-react';
import { getProjectTags } from '@/data/mockData';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { isAuthenticated } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const isPrivate = project.isPrivate;
  const projectTags = getProjectTags(project);
  
  // Format date
  const formattedDate = new Date(project.dateUpdated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  // Handle image loading
  useEffect(() => {
    if (project.coverImage) {
      const img = new Image();
      img.src = project.coverImage;
      img.onload = () => setImageLoaded(true);
    } else {
      setImageLoaded(true);
    }
  }, [project.coverImage]);

  return (
    <Link to={`/project/${project.id}`}>
      <Card className="overflow-hidden hover-lift group h-full">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {project.coverImage ? (
            <>
              <div 
                className={`absolute inset-0 bg-muted ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              />
              <img
                src={project.coverImage}
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

          {(isAuthenticated || !isPrivate) && projectTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {projectTags.map(tag => (
                <div key={tag.id} className="group relative">
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    <TagIcon className="h-3 w-3" />
                    {tag.name}
                  </Badge>
                  
                  {tag.description && (
                    <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-popover text-popover-foreground shadow-md rounded-md px-3 py-2 text-xs max-w-[200px]">
                        {tag.description}
                        <div className="absolute w-2 h-2 bg-popover rotate-45 left-1/2 transform -translate-x-1/2 top-full -mt-1"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 pb-4 flex justify-between">
          <div className="text-sm text-muted-foreground">
            By <span className="font-medium">{project.creatorName}</span>
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
