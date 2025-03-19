
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-background to-cu-light-gold/20 py-16 md:py-24">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge variant="outline" className="mb-4 border-cu-gold text-cu-gold">Student Showcase Platform</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4">
            Generative AI Innovation at ATLAS
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Exploring the frontier of AI creativity at CU Boulder. Showcasing student projects from the ATLAS Institute's Generative AI program.
          </p>
          <Button size="lg" className="rounded-full bg-cu-gold text-cu-black hover:bg-cu-light-gold" asChild>
            <a href="#projects">
              Explore Projects <ArrowRight className="ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
