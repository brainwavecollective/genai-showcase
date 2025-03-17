
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Lock } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { isAuthenticated } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const isPrivate = project.isPrivate;
  
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
