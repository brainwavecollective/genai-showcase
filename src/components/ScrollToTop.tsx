
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top with a slight delay to ensure it takes precedence
    // over any other scroll behavior
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    }, 0);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
