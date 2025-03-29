
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  requestMagicLink: (email: string) => Promise<boolean>;
  confirmMagicLink: (token: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  magicLinkRequested: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [magicLinkRequested, setMagicLinkRequested] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Fetch user data from our users table
          setTimeout(async () => {
            try {
              const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error('Error fetching user data:', error);
                return;
              }
              
              console.log('User data fetched:', userData);
              // Cast the role to UserRole type to match our type definition
              setUser({
                ...userData,
                role: userData.role as UserRole,
                status: userData.status as UserStatus
              });
              setIsAuthenticated(true);
            } catch (error) {
              console.error('Failed to fetch user data:', error);
            }
          }, 0);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Check for an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      if (session?.user) {
        // Fetch user data from our users table
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching user data:', error);
              return;
            }
            
            console.log('User data fetched on init:', data);
            // Cast the role to UserRole type to match our type definition
            setUser({
              ...data,
              role: data.role as UserRole,
              status: data.status as UserStatus
            });
            setIsAuthenticated(true);
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', email);
      
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
      
      setMagicLinkRequested(true);
      
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
    setMagicLinkRequested(false);
    return true;
  };

  const logout = async () => {
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
    
    setUser(null);
    setIsAuthenticated(false);
    setMagicLinkRequested(false);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        requestMagicLink,
        confirmMagicLink,
        logout,
        isAdmin: user?.role === 'admin',
        magicLinkRequested,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
