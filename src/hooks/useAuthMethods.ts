
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAuthMethods() {
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', email);
      
      if (!email || !password) {
        console.warn('Login failed: Empty email or password');
        toast({
          title: "Login failed",
          description: "Email and password are required",
          variant: "destructive",
        });
        return false;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      console.log('Login successful:', data);
      
      // User data will be fetched by the onAuthStateChange handler
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return true;
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Function to request a magic link
  const requestMagicLink = async (email: string): Promise<boolean> => {
    try {
      if (!email) {
        toast({
          title: "Failed to send magic link",
          description: "Email is required",
          variant: "destructive",
        });
        return false;
      }
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (error) {
        toast({
          title: "Failed to send magic link",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Magic link sent",
        description: "Check your email for a login link",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Failed to send magic link",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Function to confirm a magic link token
  const confirmMagicLink = async (token: string): Promise<boolean> => {
    // In a real implementation, this would validate the token
    // For Supabase, this is usually handled automatically via URL parameters
    // This function is kept for API compatibility
    return true;
  };

  const logout = async () => {
    try {
      console.log('Attempting logout');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      console.log('Logout successful');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return {
    login,
    requestMagicLink,
    confirmMagicLink,
    logout
  };
}
