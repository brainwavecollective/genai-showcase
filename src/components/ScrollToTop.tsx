
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top immediately with no animation
    // This has higher priority than any other scroll behavior
    window.scrollTo(0, 0);
    
    // As a backup, also scroll after a slight delay
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
