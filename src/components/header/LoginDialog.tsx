
import { useState, useEffect } from 'react';
import { Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

export function LoginDialog() {
  const { login, requestMagicLink, confirmMagicLink, magicLinkRequested } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [magicToken, setMagicToken] = useState('');
  const [loginMethod, setLoginMethod] = useState<'password' | 'magic'>('password');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenLoginDialog = () => {
      console.log('Open login dialog event received');
      setIsLoginOpen(true);
      // Reset the form state when opening
      setLoginError(null);
      setIsSubmitting(false);
    };
    
    document.addEventListener('open-login-dialog', handleOpenLoginDialog);
    
    return () => {
      document.removeEventListener('open-login-dialog', handleOpenLoginDialog);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted', { email, password });
    
    if (isSubmitting) return;
    
    setLoginError(null);
    setIsSubmitting(true);
    
    try {
      console.log('Attempting login with credentials...');
      const success = await login(email, password);
      console.log('Login attempt result:', success);
      
      if (success) {
        console.log('Login successful, closing dialog');
        setIsLoginOpen(false);
        setEmail('');
        setPassword('');
      } else {
        setLoginError('Invalid login credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMagicLinkRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Magic link requested for:', email);
    
    if (isSubmitting) return;
    
    setLoginError(null);
    setIsSubmitting(true);
    
    try {
      await requestMagicLink(email);
    } catch (error) {
      console.error('Magic link request error:', error);
      setLoginError('Failed to send magic link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMagicLinkConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Magic link confirmation with token:', magicToken);
    
    if (isSubmitting) return;
    
    setLoginError(null);
    setIsSubmitting(true);
    
    try {
      const success = await confirmMagicLink(magicToken);
      if (success) {
        setIsLoginOpen(false);
        setEmail('');
        setMagicToken('');
      } else {
        setLoginError('Invalid or expired token. Please try again.');
      }
    } catch (error) {
      console.error('Magic link confirmation error:', error);
      setLoginError('Failed to verify the magic link token.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      setIsLoginOpen(false);
      // Reset form state when closing
      setLoginError(null);
    }
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md animate-fade-in animate-slide-up">
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
          <DialogDescription>
            Sign in to access your account
          </DialogDescription>
        </DialogHeader>
        
        {loginError && (
          <Alert variant="destructive" className="my-2">
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}
        
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  For demo: Try using test-admin-1@cu.edu with password123
                </p>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
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
                    disabled={isSubmitting}
                  />
                </div>
                
                <p className="text-xs text-muted-foreground">
                  We'll send a secure login link to your email
                </p>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Magic Link'}
                  </Button>
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
                    disabled={isSubmitting}
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify Token'}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
