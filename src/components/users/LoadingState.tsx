
const LoadingState = () => {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-muted/40 rounded animate-pulse" />
      ))}
    </div>
  );
};

export default LoadingState;
