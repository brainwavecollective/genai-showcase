
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Home, Bot, Mountain, Brain } from 'lucide-react';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const sheetTriggerRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setOpen(false);
  };

  // Trap focus within the menu when open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        sheetTriggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger 
        ref={sheetTriggerRef} 
        aria-label="Open main menu"
        className="md:hidden"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="min-h-screen flex flex-col">
          <nav className="flex-1 pt-16">
            <ul className="space-y-2 px-2">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-3 text-base hover:bg-muted rounded-md transition-colors"
                  onClick={handleLinkClick}
                >
                  <Home size={20} />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="flex items-center gap-3 px-4 py-3 text-base hover:bg-muted rounded-md transition-colors"
                  onClick={handleLinkClick}
                >
                  <Mountain size={20} />
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/chat"
                  className="flex items-center gap-3 px-4 py-3 text-base hover:bg-muted rounded-md transition-colors"
                  onClick={handleLinkClick}
                >
                  <Bot size={20} />
                  Chat with AI
                </Link>
              </li>
              <li>
                <a
                  href="https://brainwavecollective.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-base hover:bg-muted rounded-md transition-colors"
                  onClick={handleLinkClick}
                >
                  <Brain size={20} />
                  Brain Wave Collective
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
