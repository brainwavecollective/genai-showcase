
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message = "Media content not found" }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertDescription>
        Error: {message}
      </AlertDescription>
    </Alert>
  );
}
