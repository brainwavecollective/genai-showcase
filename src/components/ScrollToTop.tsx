
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to the very top for non-home pages
    if (pathname !== '/') {
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
    } else {
      // For home page, scroll to a position just above the "Student Showcase Platform" badge
      // Use a slight delay to ensure proper execution after render
      setTimeout(() => {
        window.scrollTo(0, 220);
      }, 100);
      
      // Try again to ensure it works
      setTimeout(() => {
        window.scrollTo(0, 220);
      }, 300);
    }
    
    return () => {};
  }, [pathname]);

  return null;
}
