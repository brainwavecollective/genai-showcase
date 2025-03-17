
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { getProjectById, getUserById, getCommentsForMediaItem, canEditProject, getProjectTags } from '@/data/mockData';
import { MediaItem, Project, Comment } from '@/types';
import { ArrowLeft, Calendar } from 'lucide-react';
import { ShowcaseLoading } from '@/components/showcase/ShowcaseLoading';
import { ShowcaseError } from '@/components/showcase/ShowcaseError';
import { ShowcaseNotFound } from '@/components/showcase/ShowcaseNotFound';
import { ProjectHeader } from '@/components/showcase/ProjectHeader';
import { MediaList } from '@/components/showcase/MediaList';
import { MediaContent } from '@/components/showcase/MediaContent';

const ShowcasePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [projectTags, setProjectTags] = useState<any[]>([]);
  const [creator, setCreator] = useState<any>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  
  // Fetch project data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      if (!id) {
        setError('Project ID is missing');
        setIsLoading(false);
        return;
      }
      
      const foundProject = getProjectById(id);
      
      if (!foundProject) {
        setError('Project not found');
        setIsLoading(false);
        return;
      }
      
      // If project is private and user is not authenticated, show error
      if (foundProject.isPrivate && !isAuthenticated) {
        setError('This project is private. Please sign in to view it.');
        setIsLoading(false);
        return;
      }
      
      setProject(foundProject);
      setProjectTags(getProjectTags(foundProject));
      
      // Set the first media item as selected by default if available
      if (foundProject.mediaItems.length > 0) {
        setSelectedMedia(foundProject.mediaItems[0]);
        setComments(getCommentsForMediaItem(foundProject.mediaItems[0].id));
      }
      
      // Get creator info
      const projectCreator = getUserById(foundProject.creatorId);
      setCreator(projectCreator);
      
      // Check if user can edit
      if (user) {
        setCanEdit(canEditProject(user, foundProject));
      }
      
      setIsLoading(false);
    }, 800);
  }, [id, isAuthenticated, user]);
  
  // Handle media selection
  const handleMediaSelect = (media: MediaItem) => {
    setSelectedMedia(media);
    setComments(getCommentsForMediaItem(media.id));
  };
  
  // Handle adding new comment
  const handleAddComment = (comment: Comment) => {
    setComments(prev => [comment, ...prev]);
  };
  
  // Handle adding new media
  const handleAddMedia = (media: MediaItem) => {
    if (project) {
      const updatedProject = {
        ...project,
        mediaItems: [media, ...project.mediaItems],
      };
      setProject(updatedProject);
      setSelectedMedia(media);
      setComments([]);
    }
  };
  
  // Handle privacy toggle
  const handlePrivacyToggle = (isPrivate: boolean) => {
    if (project) {
      setProject({
        ...project,
        isPrivate,
      });
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <ShowcaseLoading />;
  }

  if (error) {
    return <ShowcaseError error={error} />;
  }

  if (!project) {
    return <ShowcaseNotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          {/* Back button */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </div>
          
          {/* Project header - centered */}
          <ProjectHeader 
            project={project}
            creator={creator}
            canEdit={canEdit}
            projectTags={projectTags}
            onTogglePrivacy={handlePrivacyToggle}
          />
          
          {/* Project content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar with media items list */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <MediaList 
                mediaItems={project.mediaItems}
                selectedMedia={selectedMedia}
                onMediaSelect={handleMediaSelect}
                canEdit={canEdit}
                projectId={project.id}
                onMediaAdded={handleAddMedia}
              />
            </div>
            
            {/* Main content area */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <MediaContent 
                selectedMedia={selectedMedia}
                comments={comments}
                onAddComment={handleAddComment}
              />
            </div>
          </div>
          
          {/* Last updated date at the bottom */}
          <div className="text-center mt-16 text-sm text-muted-foreground flex items-center justify-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Last updated {formatDate(project.dateUpdated)}</span>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShowcasePage;
