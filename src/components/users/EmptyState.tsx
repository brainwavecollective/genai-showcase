
interface EmptyStateProps {
  searchQuery: string;
}

const EmptyState = ({ searchQuery }: EmptyStateProps) => {
  return (
    <div className="text-center py-12 bg-muted/20 rounded-md">
      <h3 className="text-lg font-medium">No users found</h3>
      <p className="text-muted-foreground mt-1">
        {searchQuery ? "Try a different search term" : "Add users to get started"}
      </p>
    </div>
  );
};

export default EmptyState;
