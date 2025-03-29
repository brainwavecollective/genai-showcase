
import { useState } from 'react';
import { useSessionHandler } from '@/hooks/auth/useSessionHandler';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { AuthHookReturn } from '@/types/auth-types';

export function useSupabaseAuth(): AuthHookReturn {
  const {
    user,
    isAuthenticated,
    session,
    isAdmin,
    isInitializing
  } = useSessionHandler();
  
  const [magicLinkRequested, setMagicLinkRequested] = useState<boolean>(false);
  const { login, requestMagicLink, confirmMagicLink, logout } = useAuthMethods();

  return {
    user,
    isAuthenticated,
    session,
    magicLinkRequested,
    setMagicLinkRequested,
    isAdmin,
    isInitializing,
    login,
    requestMagicLink,
    confirmMagicLink,
    logout
  };
}
