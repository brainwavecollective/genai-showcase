
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/ProjectCard';
import { Project, Tag } from '@/types';

interface ProjectGridProps {
  isLoading: boolean;
  visibleProjects: Project[];
  tags: Tag[];
}

export function ProjectGrid({ isLoading, visibleProjects, tags }: ProjectGridProps) {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-80 bg-muted/40 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (visibleProjects.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium mb-2">No projects found</h3>
        <p className="text-muted-foreground">
          Try different search terms or tag filters
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {visibleProjects.map((project) => (
          <motion.div key={project.id} variants={item}>
            <ProjectCard 
              project={project} 
              tags={tags.filter(tag => project.tag_ids?.includes(tag.id))}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {visibleProjects.length > 0 && (
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Projects
          </Button>
        </div>
      )}
    </>
  );
}
