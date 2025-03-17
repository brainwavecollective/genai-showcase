
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, LogOut } from 'lucide-react';

export function Header() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Add scroll event listener to change header style on scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      setIsLoginOpen(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8 md:py-4 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/"
          className="text-xl md:text-2xl font-display font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          Showcase
        </Link>

        <nav className="flex items-center space-x-1 md:space-x-2">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center text-sm mr-2">
                <span className="text-muted-foreground">Signed in as</span>
                <span className="font-medium ml-1">{user?.name}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={logout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Log out</span>
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-1"
            >
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Log in</span>
            </Button>
          )}
          
          <ThemeToggle />
        </nav>
      </div>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md animate-fade-in animate-slide-up">
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>
              Enter your email to sign in to your account
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                For demo: Use any email from the mock data (e.g., larissa@example.com, alex@example.com)
                <br />
                Password can be anything
              </p>
            </div>
            
            <DialogFooter>
              <Button type="submit" className="w-full">Sign in</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}
