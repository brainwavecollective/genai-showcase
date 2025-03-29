
import React, { createContext, useContext } from 'react';
import { User } from '../types';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useAuthMethods } from '@/hooks/useAuthMethods';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  requestMagicLink: (email: string) => Promise<boolean>;
  confirmMagicLink: (token: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  magicLinkRequested: boolean;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    isAuthenticated, 
    magicLinkRequested, 
    setMagicLinkRequested,
    isAdmin,
    isInitializing
  } = useSupabaseAuth();
  
  const { login, requestMagicLink: reqMagicLink, confirmMagicLink: confMagicLink, logout } = useAuthMethods();

  // Wrap the original requestMagicLink to update the magicLinkRequested state
  const requestMagicLink = async (email: string): Promise<boolean> => {
    const result = await reqMagicLink(email);
    if (result) {
      setMagicLinkRequested(true);
    }
    return result;
  };

  // Wrap the original confirmMagicLink to update the magicLinkRequested state
  const confirmMagicLink = async (token: string): Promise<boolean> => {
    const result = await confMagicLink(token);
    if (result) {
      setMagicLinkRequested(false);
    }
    return result;
  };

  // Log authentication state for debugging
  console.log('AuthProvider state:', { isAuthenticated, user, isAdmin, isInitializing });

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        requestMagicLink,
        confirmMagicLink,
        logout,
        isAdmin,
        magicLinkRequested,
        isInitializing,
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
