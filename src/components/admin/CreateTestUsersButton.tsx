
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createTestUsers } from '@/utils/createTestUsers';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function CreateTestUsersButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleCreateTestUsers = async () => {
    setIsLoading(true);
    
    try {
      const result = await createTestUsers();
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Test users have been created successfully",
        });
        console.log("Test users created:", result.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to create test users",
          variant: "destructive",
        });
        console.error("Error:", result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Exception:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleCreateTestUsers} 
      disabled={isLoading}
      variant="outline"
      className="gap-2"
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      Create Test Users
    </Button>
  );
}
