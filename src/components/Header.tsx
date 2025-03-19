
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, LogOut, Mail, KeyRound, CheckCircle2, UserCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const { isAuthenticated, user, login, logout, requestMagicLink, confirmMagicLink, magicLinkRequested, isAdmin } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [magicToken, setMagicToken] = useState('');
  const [loginMethod, setLoginMethod] = useState<'password' | 'magic'>('password');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleMagicLinkRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestMagicLink(email);
  };

  const handleMagicLinkConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await confirmMagicLink(magicToken);
    if (success) {
      setIsLoginOpen(false);
      setEmail('');
      setMagicToken('');
    }
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user?.avatar_url} alt={user?.name || 'User'} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline ml-2">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => navigate('/profile')}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigate('/manage-users')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Manage Users
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              Sign in to access your account
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="password" onValueChange={(value) => setLoginMethod(value as 'password' | 'magic')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password" className="flex items-center gap-1">
                <KeyRound className="h-4 w-4" />
                Password
              </TabsTrigger>
              <TabsTrigger value="magic" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Magic Link
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="password">
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
            </TabsContent>
            
            <TabsContent value="magic">
              {!magicLinkRequested ? (
                <form onSubmit={handleMagicLinkRequest} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="magic-email">Email</Label>
                    <Input
                      id="magic-email"
                      type="email"
                      placeholder="hello@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    We'll send a secure login link to your email
                    <br />
                    For demo: Use any email from the mock data
                  </p>
                  
                  <DialogFooter>
                    <Button type="submit" className="w-full">Send Magic Link</Button>
                  </DialogFooter>
                </form>
              ) : (
                <form onSubmit={handleMagicLinkConfirm} className="space-y-4 pt-2">
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      We've sent a login link to your email. Enter the token below to sign in.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <Label htmlFor="magic-token">Magic Link Token</Label>
                    <Input
                      id="magic-token"
                      type="text"
                      placeholder="Enter token from email"
                      value={magicToken}
                      onChange={(e) => setMagicToken(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      For demo: Enter any text as token
                    </p>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" className="w-full">Verify Token</Button>
                  </DialogFooter>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </header>
  );
}
