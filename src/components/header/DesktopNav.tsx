
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MountainSnow, Bot } from 'lucide-react';

export function DesktopNav() {
  return (
    <nav className="hidden md:flex items-center space-x-4">
      <NavLink to="/" className="text-foreground/90 hover:text-foreground flex items-center gap-2 transition-colors">
        <Button variant="ghost" className="text-base">Home</Button>
      </NavLink>
      <NavLink to="/chat" className="text-foreground/90 hover:text-foreground flex items-center gap-2 transition-colors">
        <Button variant="ghost" className="text-base gap-2">
          <Bot size={16} />
          Chat
        </Button>
      </NavLink>
      <NavLink to="/about" className="text-foreground/90 hover:text-foreground">
        <Button variant="ghost" className="text-base">About</Button>
      </NavLink>
      <a href="https://brainwavecollective.ai" target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" className="text-base gap-2">
          <MountainSnow size={16} />
          BWC
        </Button>
      </a>
    </nav>
  );
}
