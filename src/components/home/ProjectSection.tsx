
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Project, Tag } from '@/types';
import { SearchAndFilterBar } from './SearchAndFilterBar';
import { ProjectGrid } from './ProjectGrid';

interface ProjectSectionProps {
  projects: Project[];
  tags: Tag[];
}

export function ProjectSection({ projects, tags }: ProjectSectionProps) {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'public' | 'private'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleProjects, setVisibleProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter projects based on authentication state, selected tab, search query, and tags
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      let filtered = [...projects];
      
      // Filter by tab
      if (selectedTab === 'public') {
        filtered = filtered.filter(project => !project.is_private);
      } else if (selectedTab === 'private') {
        filtered = filtered.filter(project => project.is_private);
      }
      
      // If not authenticated, only show non-private projects
      if (!isAuthenticated) {
        filtered = filtered.filter(project => !project.is_private);
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(project =>
          project.title.toLowerCase().includes(query) ||
          (project.description && project.description.toLowerCase().includes(query)) ||
          project.creator_name?.toLowerCase().includes(query)
        );
      }
      
      // Filter by selected tags
      if (selectedTags.length > 0) {
        filtered = filtered.filter(project => 
          selectedTags.some(tagId => project.tag_ids?.includes(tagId))
        );
      }
      
      setVisibleProjects(filtered);
      setIsLoading(false);
    }, 500);
  }, [searchQuery, selectedTab, isAuthenticated, selectedTags, projects]);

  return (
    <section id="projects" className="container max-w-7xl mx-auto px-4 md:px-8 py-16">
      <SearchAndFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        tags={tags}
        isAuthenticated={isAuthenticated}
      />
      
      <ProjectGrid 
        isLoading={isLoading}
        visibleProjects={visibleProjects}
        tags={tags}
      />
    </section>
  );
}
