
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, UserStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [magicLinkRequested, setMagicLinkRequested] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const { toast } = useToast();

  // Initialize auth state and setup listeners
  useEffect(() => {
    console.log('Setting up auth state listeners...');
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Fetch user data from our users table
          try {
            console.log('Fetching user data for', currentSession.user.id);
            const { data: userData, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', currentSession.user.id)
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
        } else {
          console.log('No active session, clearing user state');
          setUser(null);
          setIsAuthenticated(false);
        }
        
        setIsInitializing(false);
      }
    );

    // Initial check for an existing session
    const checkExistingSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        console.log('Initial session check:', existingSession?.user?.email);
        
        if (existingSession?.user) {
          setSession(existingSession);
          // Fetch user data from our users table
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', existingSession.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user data on init:', error);
            setIsInitializing(false);
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
        }
        
        setIsInitializing(false);
      } catch (error) {
        console.error('Error checking existing session:', error);
        setIsInitializing(false);
      }
    };
    
    checkExistingSession();

    return () => {
      console.log('Cleaning up auth state listeners');
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = user?.role === 'admin';

  return {
    user,
    isAuthenticated,
    session,
    magicLinkRequested,
    setMagicLinkRequested,
    isAdmin,
    isInitializing
  };
}
