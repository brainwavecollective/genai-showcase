
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileNav } from '@/components/header/MobileNav';
import { DesktopNav } from '@/components/header/DesktopNav';
import { UserMenu } from '@/components/header/UserMenu';
import { LoginDialog } from '@/components/header/LoginDialog';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    // Add scroll event listener to change header style on scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Ensure the login dialog is properly initialized on mount
    console.log('Header component mounted, auth state:', { isAuthenticated, isInitializing });

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated, isInitializing]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8 md:py-4 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <MobileNav />
          <Link 
            to="/"
            className="text-xl md:text-2xl font-display font-bold tracking-tight hover:opacity-90 transition-opacity"
          >
            ATLAS GenAI Showcase
          </Link>
        </div>

        <DesktopNav />

        <nav className="flex items-center space-x-1 md:space-x-2">
          <UserMenu />
          <ThemeToggle />
        </nav>
      </div>

      {/* Always render the login dialog so it's accessible via the custom event */}
      <LoginDialog />
    </header>
  );
}
