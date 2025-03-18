
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useToast } from '@/hooks/use-toast';

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Larissa Thompson',
    email: 'larissa@example.com',
    role: 'admin',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    role: 'creator',
    avatar_url: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Maya Patel',
    email: 'maya@example.com',
    role: 'creator',
    avatar_url: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    role: 'creator',
    avatar_url: 'https://i.pravatar.cc/150?img=4',
  },
];

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
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would validate with a backend
    // For demo, just check if email exists in our mock data
    // Password is ignored in this mock implementation
    
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(foundUser));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      
      return false;
    }
  };

  // Function to request a magic link
  const requestMagicLink = async (email: string): Promise<boolean> => {
    // In a real app, this would send an email with a magic link
    // For this mock implementation, we'll just check if the email exists
    
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      // In a real app, generate a token and send an email
      // For demo purposes, we'll just store the email in localStorage
      localStorage.setItem('pendingMagicLinkEmail', email);
      setMagicLinkRequested(true);
      
      toast({
        title: "Magic link sent",
        description: `Check your email for a login link. (For demo: use any token)`,
      });
      
      return true;
    } else {
      toast({
        title: "Failed to send magic link",
        description: "Email not found in our records",
        variant: "destructive",
      });
      
      return false;
    }
  };

  // Function to confirm a magic link token
  const confirmMagicLink = async (token: string): Promise<boolean> => {
    // In a real app, validate the token
    // For this mock, we'll just check if there's a pending email
    
    const email = localStorage.getItem('pendingMagicLinkEmail');
    
    if (email) {
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        setMagicLinkRequested(false);
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(foundUser));
        localStorage.removeItem('pendingMagicLinkEmail');
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
        
        return true;
      }
    }
    
    toast({
      title: "Login failed",
      description: "Invalid or expired magic link",
      variant: "destructive",
    });
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setMagicLinkRequested(false);
    localStorage.removeItem('user');
    localStorage.removeItem('pendingMagicLinkEmail');
    
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
