
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, UserStatus } from '@/types';
import { GetUserByIdResponse } from '@/types/supabase-functions';
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
              
              // Use the RPC function to safely fetch user data
              const { data: userData, error } = await supabase
                .rpc<GetUserByIdResponse>('get_user_by_id', { user_id: currentSession.user?.id });
              
              if (error || !userData) {
                console.error('Error fetching user data with RPC:', error);
                
                // Fallback to a minimal user object based on auth data
                const email = currentSession.user.email || '';
                const minimalUser: User = {
                  id: currentSession.user.id,
                  email: email,
                  name: email.split('@')[0] || 'User', // Use part of email as name or default to 'User'
                  role: 'visitor' as UserRole, // Default role
                  status: 'pending_review' as UserStatus, // Default status
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                
                if (mounted) {
                  setUser(minimalUser);
                  setIsAuthenticated(true);
                  setIsInitializing(false);
                }
                return;
              }
              
              if (!mounted) return;
              
              console.log('User data fetched:', userData);
              
              // Cast the user data to our User type
              setUser(userData as User);
              setIsAuthenticated(true);
              setIsInitializing(false);
            } catch (error) {
              console.error('Failed to fetch user data:', error);
              
              // Even on failure, set authenticated if we have a session
              if (mounted) {
                setIsAuthenticated(true);
                
                // Create a minimal user object based on auth data
                const email = currentSession.user.email || '';
                const minimalUser: User = {
                  id: currentSession.user.id,
                  email: email,
                  name: email.split('@')[0] || 'User',
                  role: 'visitor' as UserRole,
                  status: 'pending_review' as UserStatus,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                
                setUser(minimalUser);
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
            // Use the RPC function to get user data
            const { data, error } = await supabase
              .rpc<GetUserByIdResponse>('get_user_by_id', { user_id: existingSession.user.id });
            
            if (error || !data) {
              console.error('Error fetching user data on init with RPC:', error);
              
              // Even if we fail to fetch user data, we know the user is authenticated
              // by Supabase, so set the authentication state
              if (mounted) {
                setIsAuthenticated(true);
                
                // Create a minimal user object based on auth data only
                const email = existingSession.user.email || '';
                const minimalUser: User = {
                  id: existingSession.user.id,
                  email: email,
                  name: email.split('@')[0] || 'User', 
                  role: 'visitor' as UserRole, 
                  status: 'pending_review' as UserStatus,
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
            // Set the user data
            setUser(data as User);
            setIsAuthenticated(true);
          } catch (err) {
            console.error('Exception fetching user data:', err);
            
            // Create a minimal user object on error
            if (mounted) {
              setIsAuthenticated(true);
              const email = existingSession.user.email || '';
              const minimalUser: User = {
                id: existingSession.user.id,
                email: email,
                name: email.split('@')[0] || 'User',
                role: 'visitor' as UserRole,
                status: 'pending_review' as UserStatus,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setUser(minimalUser);
            }
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

  // Determine admin status - add debugging to see if we're getting the correct role
  const isAdmin = user?.role === 'admin';
  
  useEffect(() => {
    // Add debug logging for admin status
    console.log('User role:', user?.role);
    console.log('Is admin?', isAdmin);
  }, [user?.role, isAdmin]);

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
