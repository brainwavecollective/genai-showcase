
import { Project, Tag } from '@/types';
import { Skeleton } from "@/components/ui/skeleton";
import { useUsers } from '@/hooks/useUsers';
import { filterContentByUserStatus } from '@/utils/contentFilters';
import { ProjectCard } from '@/components/ProjectCard';

interface ProjectGridProps {
  projects?: Project[];
  isLoading?: boolean;
  visibleProjects?: Project[];
  tags?: Tag[];
}

const ProjectGrid = ({ projects = [], isLoading = false, visibleProjects, tags }: ProjectGridProps) => {
  const { isUserDenied } = useUsers();
  
  // Use visibleProjects if provided, otherwise filter projects
  const projectsToDisplay = visibleProjects ?? filterContentByUserStatus(projects, isUserDenied);
  
  console.log("ProjectGrid rendering with projects:", projectsToDisplay);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {isLoading ? (
        // Display skeleton loaders while loading
        [...Array(8)].map((_, i) => (
          <Skeleton key={i} className="w-full aspect-video rounded-md" />
        ))
      ) : projectsToDisplay.length > 0 ? (
        // Display project cards if there are projects
        projectsToDisplay.map((project) => (
          <ProjectCard key={project.id} project={project} tags={tags} />
        ))
      ) : (
        // Display a message if there are no projects
        <div className="col-span-full text-center py-6">
          <p className="text-muted-foreground">No projects found.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectGrid;
