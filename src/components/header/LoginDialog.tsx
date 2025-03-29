
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

  useEffect(() => {
    const handleOpenLoginDialog = () => setIsLoginOpen(true);
    document.addEventListener('open-login-dialog', handleOpenLoginDialog);
    
    return () => {
      document.removeEventListener('open-login-dialog', handleOpenLoginDialog);
    };
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

  return (
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
                  For demo: Try using test-admin-1@cu.edu with password123
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
  );
}
