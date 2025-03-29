
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
  const { toast } = useToast();

  // Initialize auth state and setup listeners
  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Fetch user data from our users table
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

  const isAdmin = user?.role === 'admin';

  return {
    user,
    isAuthenticated,
    session,
    magicLinkRequested,
    setMagicLinkRequested,
    isAdmin
  };
}
