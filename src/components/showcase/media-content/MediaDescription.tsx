
interface MediaDescriptionProps {
  description: string | undefined;
}

export function MediaDescription({ description }: MediaDescriptionProps) {
  if (!description) return null;
  
  return (
    <p className="text-muted-foreground mb-6">{description}</p>
  );
}
