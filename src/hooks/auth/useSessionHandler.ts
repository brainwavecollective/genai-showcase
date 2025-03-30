
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, UserStatus } from '@/types';
import { GetUserByIdResponse } from '@/types/supabase-functions';

export function useSessionHandler() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Determine admin status
  const isAdmin = user?.role === 'admin';

  // Helper function to create a minimal user from session data
  const createMinimalUser = (sessionUser: Session['user']): User => {
    const email = sessionUser.email || '';
    return {
      id: sessionUser.id,
      email: email,
      name: email.split('@')[0] || 'User',
      role: 'visitor' as UserRole,
      status: 'pending_review' as UserStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  };

  // Fetch user data using RPC function
  const fetchUserData = async (userId: string, onSuccess: (userData: User) => void) => {
    try {
      console.log('Fetching user data for', userId);
      
      // Fix: Add proper type arguments to the rpc method call
      const { data: userData, error } = await supabase
        .rpc('get_user_by_id', { user_id: userId });
      
      if (error || !userData) {
        console.error('Error fetching user data with RPC:', error);
        throw error;
      }
      
      console.log('User data fetched:', userData);
      onSuccess(userData as unknown as User);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw error;
    }
  };

  // Initialize auth state and setup listeners
  useEffect(() => {
    console.log('Setting up auth state listeners...');
    let mounted = true;
    
    // Check for an existing session first to avoid flashing login state
    const checkExistingSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('Initial session check:', existingSession?.user?.email);
        
        if (existingSession?.user) {
          setSession(existingSession);
          setIsAuthenticated(true);
          
          // Fetch user data from our users table
          try {
            await fetchUserData(existingSession.user.id, (userData) => {
              if (mounted) {
                setUser(userData);
                setIsInitializing(false);
              }
            });
          } catch (err) {
            console.error('Exception fetching user data:', err);
            
            // Create a minimal user object on error
            if (mounted) {
              setUser(createMinimalUser(existingSession.user));
              setIsInitializing(false);
            }
          }
        } else {
          if (mounted) {
            setIsInitializing(false);
          }
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        if (mounted) setIsInitializing(false);
      }
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        if (!mounted) return;
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          setIsAuthenticated(true);
          
          // Fetch user data from our users table using setTimeout
          // to avoid potential deadlocks
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              await fetchUserData(currentSession.user.id, (userData) => {
                if (mounted) {
                  setUser(userData);
                  setIsInitializing(false);
                }
              });
            } catch (error) {
              console.error('Error in fetching user data:', error);
              
              // Even on failure, set authenticated if we have a session
              if (mounted) {
                setUser(createMinimalUser(currentSession.user));
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

    // Execute initial check
    checkExistingSession();

    return () => {
      console.log('Cleaning up auth state listeners');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Add debug logging for auth state
  useEffect(() => {
    console.log('Auth state updated:', {
      isAuthenticated,
      user: user?.email,
      role: user?.role,
      isAdmin,
      isInitializing
    });
  }, [isAuthenticated, user, isAdmin, isInitializing]);

  return {
    user,
    isAuthenticated,
    session,
    isAdmin,
    isInitializing,
    setUser,
    setIsAuthenticated,
    setSession,
    setIsInitializing
  };
}
