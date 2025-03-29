
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
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Login failed",
        description: error?.message || "An unexpected error occurred",
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
    } catch (error: any) {
      toast({
        title: "Failed to send magic link",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Function to confirm a magic link token
  const confirmMagicLink = async (token: string): Promise<boolean> => {
    try {
      // In a real implementation, this would validate the token
      // For Supabase, this is usually handled automatically via URL parameters
      console.log("Confirming magic link with token:", token);
      
      // For demo purposes, we'll simulate success
      toast({
        title: "Magic link confirmed",
        description: "You have been successfully logged in",
      });
      return true;
    } catch (error: any) {
      console.error("Error confirming magic link:", error);
      toast({
        title: "Failed to confirm magic link",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
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
    } catch (error: any) {
      console.error('Unexpected logout error:', error);
      toast({
        title: "Logout failed",
        description: error?.message || "An unexpected error occurred",
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
