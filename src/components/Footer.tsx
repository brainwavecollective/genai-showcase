
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="container max-w-7xl py-8 md:py-12 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="text-xl font-display font-bold tracking-tight hover:opacity-90 transition-opacity">
              Showcase
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              A platform for creators to showcase their work and inspire others through thoughtful design and innovation.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://brainwavecollective.ai/#privacy" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} Brain Wave Collective. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            We create the future.
          </p>
        </div>
      </div>
    </footer>
  );
}
