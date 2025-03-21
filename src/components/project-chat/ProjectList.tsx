
import { NavigateFunction } from 'react-router-dom';
import { Project } from '@/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  showProjects: boolean;
  setShowProjects: (show: boolean) => void;
  navigate: NavigateFunction;
}

export function ProjectList({ projects, showProjects, setShowProjects, navigate }: ProjectListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Projects</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowProjects(!showProjects)}
        >
          <ArrowDown className={`h-4 w-4 transition-transform ${showProjects ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{project.title}</CardTitle>
              <CardDescription className="text-xs">
                By {project.creator_name || "Anonymous"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description || "No description provided"}
              </p>
              {project.tag_names && project.tag_names.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.tag_names.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {project.tag_names.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{project.tag_names.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
