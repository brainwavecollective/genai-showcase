
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-background to-cu-light-gold/20 py-16 md:py-24">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left column with text content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <Badge variant="outline" className="mb-4 border-cu-gold text-cu-gold">Student Showcase Platform</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4 text-gradient bg-gradient-to-r from-cu-gold to-cu-bronze">
              Generative AI Innovation at CU
            </h1>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 md:p-6 mb-6">
              <p className="text-lg md:text-xl text-foreground/90 mb-4">
                Explore the frontier of AI innovation through cutting-edge student projects
                from CU Boulder's School of Engineering. This curated showcase highlights 
                exceptional work from Spring 2025's Generative AI course.
              </p>
              <p className="text-muted-foreground">
                Discover how tomorrow's creators are reimagining the intersection of 
                artificial intelligence, art, and interactive technology. 
                Each project represents a unique vision of AI's creative potential.
              </p>
            </div>
            <Button size="lg" className="rounded-full bg-cu-gold text-cu-black hover:bg-cu-light-gold" asChild>
              <a href="#projects">
                Explore Projects <ArrowRight className="ml-2" />
              </a>
            </Button>
          </motion.div>
          
          {/* Right column with image or decorative element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cu-gold to-cu-bronze opacity-30 blur-xl rounded-lg"></div>
              <div className="relative bg-card/80 backdrop-blur-sm border border-cu-gold/20 rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/lovable-uploads/270d895b-0c75-453f-a328-6157826d68ab.png" 
                  alt="CU Boulder campus with the Flatirons" 
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-shadow-sm text-sm font-medium">
                    University of Colorado Boulder campus with the iconic Flatirons in the background
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
