
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediately scroll to top
    window.scrollTo(0, 0);
    
    // Try again after DOM has had time to update
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    
    // And again after potential animations have completed
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);
    
    return () => {};
  }, [pathname]);

  return null;
}
