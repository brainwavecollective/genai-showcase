
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ProfileErrorProps {
  error: Error;
  onLogout: () => void;
}

export const ProfileError = ({ error, onLogout }: ProfileErrorProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-destructive/10 p-4 rounded-md">
      <h2 className="text-destructive font-semibold">Error loading profile</h2>
      <p>{error.message}</p>
      <div className="mt-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mr-2"
        >
          Go to Home
        </Button>
        <Button 
          variant="outline" 
          className="text-destructive hover:text-destructive"
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
