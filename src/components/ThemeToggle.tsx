
import { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Laptop } from 'lucide-react';
import { themes } from '@/data/mockData';

export function ThemeToggle() {
  const [theme, setTheme] = useState<string>(() => {
    // Initialize with system preference, defaulting to dark for this app
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme;
    
    return 'dark';
  });

  useEffect(() => {
    // Update html class and store preference
    const root = window.document.documentElement;
    
    // Remove any previous theme classes
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemPrefersDark ? 'dark' : 'light');
    } else {
      // Add selected theme
      root.classList.add(theme);
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  // Determine which icon to show based on current theme
  const getIcon = () => {
    if (theme === 'dark') return <Moon className="h-5 w-5" />;
    if (theme === 'light') return <Sun className="h-5 w-5" />;
    return <Laptop className="h-5 w-5" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary transition-colors duration-300">
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-fade-in animate-slide-up">
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${theme === 'light' ? 'font-medium' : ''}`}
          onClick={() => handleThemeChange('light')}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${theme === 'dark' ? 'font-medium' : ''}`}
          onClick={() => handleThemeChange('dark')}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${theme === 'system' ? 'font-medium' : ''}`}
          onClick={() => handleThemeChange('system')}
        >
          <Laptop className="h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
