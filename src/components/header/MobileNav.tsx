
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col gap-6 w-[250px] sm:w-[300px]">
        <Link 
          to="/"
          className="text-xl font-display font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          ATLAS GenAI Showcase
        </Link>
        <nav className="flex flex-col gap-4">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/projects" className="text-foreground hover:text-primary transition-colors">
            Projects
          </Link>
          <Link to="/about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/resources" className="text-foreground hover:text-primary transition-colors">
            Resources
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
