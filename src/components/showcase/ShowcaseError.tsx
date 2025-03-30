
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ShowcaseErrorProps {
  error: string;
}

export function ShowcaseError({ error }: ShowcaseErrorProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Function to retry loading the project
  const handleRetry = () => {
    setIsRetrying(true);
    
    // Display toast
    toast({
      title: "Retrying...",
      description: "Attempting to reload the project",
    });
    
    // Refresh the current page
    setTimeout(() => {
      window.location.reload();
      setIsRetrying(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 container max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Unable to load project</h2>
          <p className="text-muted-foreground mb-2">{error}</p>
          <p className="text-sm text-muted-foreground mb-6">
            Error details: {error.includes('not found') ? 'The project may have been deleted or does not exist.' : 'There was an issue connecting to the database.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRetry}
              disabled={isRetrying}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
