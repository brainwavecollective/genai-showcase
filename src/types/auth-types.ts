
import { User, UserRole, UserStatus } from '@/types';
import { Session } from '@supabase/supabase-js';

// Auth hook state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  magicLinkRequested: boolean;
  session: Session | null;
  isInitializing: boolean;
  isAdmin: boolean;
}

// Auth hook return interface
export interface AuthHookReturn extends AuthState {
  setMagicLinkRequested: (value: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  requestMagicLink: (email: string) => Promise<boolean>;
  confirmMagicLink: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
}
