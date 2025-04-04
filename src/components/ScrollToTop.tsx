
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable any existing scroll behavior
    if (document.documentElement.style.scrollBehavior) {
      const originalScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      
      // Function to restore original behavior
      const restoreScrollBehavior = () => {
        document.documentElement.style.scrollBehavior = originalScrollBehavior;
      };
      
      // Clean up when component unmounts
      return restoreScrollBehavior;
    }
    
    // Simple scroll to top for all pages
    const handleScroll = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use instant to avoid animation conflicts
      });
    };
    
    // Execute initial scroll
    handleScroll();
    
    // Also handle scroll after a slight delay to ensure DOM is fully ready
    const timeoutId = setTimeout(handleScroll, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}
