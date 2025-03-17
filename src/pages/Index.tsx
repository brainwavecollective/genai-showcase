
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProjectCard } from '@/components/ProjectCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { projects } from '@/data/mockData';
import { Project } from '@/types';
import { Search } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'public' | 'private'>('all');
  const [visibleProjects, setVisibleProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter projects based on authentication state, selected tab, and search query
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      let filtered = [...projects];
      
      // Filter by tab
      if (selectedTab === 'public') {
        filtered = filtered.filter(project => !project.isPrivate);
      } else if (selectedTab === 'private') {
        filtered = filtered.filter(project => project.isPrivate);
      }
      
      // If not authenticated, only show non-private projects
      if (!isAuthenticated) {
        filtered = filtered.filter(project => !project.isPrivate);
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(project =>
          project.title.toLowerCase().includes(query) ||
          (project.description && project.description.toLowerCase().includes(query)) ||
          project.creatorName.toLowerCase().includes(query)
        );
      }
      
      setVisibleProjects(filtered);
      setIsLoading(false);
    }, 500);
  }, [searchQuery, selectedTab, isAuthenticated]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <section className="container max-w-7xl mx-auto px-4 md:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-4">Showcase Platform</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4">
                Discover Creative Excellence
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore a curated collection of exceptional projects from talented creators around the world.
              </p>
            </motion.div>
          </div>
          
          {/* Filters and Search */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Tabs 
              defaultValue="all" 
              value={selectedTab}
              onValueChange={(value) => setSelectedTab(value as 'all' | 'public' | 'private')}
            >
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="public">Public</TabsTrigger>
                {isAuthenticated && (
                  <TabsTrigger value="private">Private</TabsTrigger>
                )}
              </TabsList>
            </Tabs>
          </div>
          
          {/* Project Grid */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-muted/40 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : visibleProjects.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {visibleProjects.map((project) => (
                  <motion.div key={project.id} variants={item}>
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No projects found</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? "Try a different search term" 
                    : isAuthenticated 
                      ? "No projects match the current filter" 
                      : "Sign in to see private projects"}
                </p>
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
