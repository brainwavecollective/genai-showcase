
import { Project } from '@/types';
import { Card } from '@/components/ui/card';

interface ProjectInfoProps {
  project: Project;
}

export function ProjectInfo({ project }: ProjectInfoProps) {
  return (
    <Card className="mb-6 p-4 bg-muted/30">
      <h2 className="font-semibold text-lg">{project.title}</h2>
      {project.description && (
        <p className="text-sm text-muted-foreground mt-1">
          {project.description.length > 150
            ? `${project.description.substring(0, 150)}...`
            : project.description}
        </p>
      )}
    </Card>
  );
}
