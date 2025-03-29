
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
    let mounted = true;
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        if (!mounted) return;
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Fetch user data from our users table using setTimeout
          // to avoid potential deadlocks
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              console.log('Fetching user data for', currentSession.user?.id);
              const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', currentSession.user?.id)
                .single();
              
              if (error) {
                console.error('Error fetching user data:', error);
                // Even if we fail to fetch user data, we know the user is authenticated
                // by Supabase, so set the authentication state
                if (mounted) {
                  setIsAuthenticated(true);
                  
                  // Create a minimal user object based on auth data only
                  const minimalUser: User = {
                    id: currentSession.user.id,
                    email: currentSession.user.email || '',
                    role: 'user' as UserRole, // Default role
                    status: 'active' as UserStatus, // Default status
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  };
                  
                  setUser(minimalUser);
                  setIsInitializing(false);
                }
                return;
              }
              
              if (!mounted) return;
              
              console.log('User data fetched:', userData);
              // Cast the role to UserRole type to match our type definition
              setUser({
                ...userData,
                role: userData.role as UserRole,
                status: userData.status as UserStatus
              });
              setIsAuthenticated(true);
              setIsInitializing(false);
            } catch (error) {
              console.error('Failed to fetch user data:', error);
              if (mounted) {
                setIsInitializing(false);
              }
            }
          }, 0);
        } else {
          console.log('No active session, clearing user state');
          setUser(null);
          setIsAuthenticated(false);
          
          if (mounted) {
            setIsInitializing(false);
          }
        }
      }
    );

    // Initial check for an existing session
    const checkExistingSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('Initial session check:', existingSession?.user?.email);
        
        if (existingSession?.user) {
          setSession(existingSession);
          // Fetch user data from our users table
          try {
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', existingSession.user.id)
              .single();
            
            if (error) {
              console.error('Error fetching user data on init:', error);
              // Even if we fail to fetch user data, we know the user is authenticated
              // by Supabase, so set the authentication state
              if (mounted) {
                setIsAuthenticated(true);
                
                // Create a minimal user object based on auth data only
                const minimalUser: User = {
                  id: existingSession.user.id,
                  email: existingSession.user.email || '',
                  role: 'user' as UserRole, // Default role
                  status: 'active' as UserStatus, // Default status
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                
                setUser(minimalUser);
                setIsInitializing(false);
              }
              return;
            }
            
            if (!mounted) return;
            
            console.log('User data fetched on init:', data);
            // Cast the role to UserRole type to match our type definition
            setUser({
              ...data,
              role: data.role as UserRole,
              status: data.status as UserStatus
            });
            setIsAuthenticated(true);
          } catch (err) {
            console.error('Exception fetching user data:', err);
          }
        }
        
        if (mounted) {
          setIsInitializing(false);
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        if (mounted) setIsInitializing(false);
      }
    };
    
    checkExistingSession();

    return () => {
      console.log('Cleaning up auth state listeners');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Determine admin status
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
