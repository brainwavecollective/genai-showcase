
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MediaUpload } from '@/components/MediaUpload';
import { CommentSection } from '@/components/CommentSection';
import { PrivacyToggle } from '@/components/PrivacyToggle';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { getProjectById, getUserById, getCommentsForMediaItem, canEditProject, getProjectTags } from '@/data/mockData';
import { MediaItem, Project, Comment, Tag } from '@/types';
import { ArrowLeft, Calendar, User, Link as LinkIcon, File, Image, Video, FileText, Tag as TagIcon } from 'lucide-react';

const ShowcasePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [projectTags, setProjectTags] = useState<Tag[]>([]);
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
  
  // Media type icon mapping
  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'link': return <LinkIcon className="h-4 w-4" />;
      case 'document': return <File className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };
  
  // Helper to render media content
  const renderMediaContent = (media: MediaItem) => {
    switch (media.mediaType) {
      case 'image':
        return (
          <div className="flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden max-h-[500px]">
            <img 
              src={media.mediaUrl} 
              alt={media.title} 
              className="max-w-full max-h-[500px] object-contain"
            />
          </div>
        );
      case 'video':
        return (
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <Video className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p>Video content would be displayed here</p>
            <a 
              href={media.mediaUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline mt-2 inline-block"
            >
              Open video link
            </a>
          </div>
        );
      case 'link':
        return (
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <LinkIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p>External link content</p>
            <a 
              href={media.mediaUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline mt-2 inline-block"
            >
              Visit link
            </a>
          </div>
        );
      case 'document':
        return (
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <File className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p>Document would be displayed here</p>
            <a 
              href={media.mediaUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline mt-2 inline-block"
            >
              Open document
            </a>
          </div>
        );
      case 'text':
        return (
          <div className="bg-muted/10 rounded-lg p-6 text-foreground">
            <p className="whitespace-pre-line">{media.mediaUrl}</p>
          </div>
        );
      default:
        return <div>Unsupported media type</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 container max-w-7xl mx-auto px-4 md:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-1/4 bg-muted/70 rounded" />
            <div className="h-12 w-3/4 bg-muted/70 rounded" />
            <div className="h-6 w-1/2 bg-muted/70 rounded" />
            <div className="h-[400px] bg-muted/70 rounded-lg" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 container max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Unable to load project</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 container max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Project not found</h2>
            <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">{project.title}</h1>
            
            {project.description && (
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">{project.description}</p>
            )}
            
            {/* Display project tags with descriptions */}
            {projectTags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {projectTags.map(tag => (
                  <div key={tag.id} className="group relative">
                    <Badge 
                      variant="secondary" 
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      <TagIcon className="h-3 w-3" />
                      {tag.name}
                    </Badge>
                    
                    {tag.description && (
                      <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                        <div className="bg-popover text-popover-foreground shadow-md rounded-md px-3 py-2 text-sm max-w-[200px]">
                          {tag.description}
                          <div className="absolute w-2 h-2 bg-popover rotate-45 left-1/2 transform -translate-x-1/2 top-full -mt-1"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Avatar>
                {creator?.avatar && <AvatarImage src={creator.avatar} />}
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{creator?.name || project.creatorName}</p>
                <p className="text-xs text-muted-foreground">{creator?.role || 'Creator'}</p>
              </div>
              
              {canEdit && (
                <PrivacyToggle 
                  isPrivate={project.isPrivate} 
                  projectId={project.id}
                  onToggle={handlePrivacyToggle}
                />
              )}
            </div>
          </motion.div>
          
          {/* Project content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar with media items list */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium">Media Items</h2>
                  {canEdit && (
                    <MediaUpload 
                      projectId={project.id} 
                      onMediaAdded={handleAddMedia}
                    />
                  )}
                </div>
                
                {project.mediaItems.length === 0 ? (
                  <Card>
                    <CardContent className="p-4 text-center text-muted-foreground">
                      No media items available
                    </CardContent>
                  </Card>
                ) : (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      {project.mediaItems.map((media) => (
                        <Card
                          key={media.id}
                          className={`cursor-pointer transition-all hover:bg-accent/50 ${
                            selectedMedia?.id === media.id ? 'ring-2 ring-primary bg-accent/30' : ''
                          }`}
                          onClick={() => handleMediaSelect(media)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-2">
                              <div className="mt-1 text-muted-foreground">
                                {getMediaTypeIcon(media.mediaType)}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium leading-tight">{media.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(media.dateCreated).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
            
            {/* Main content area */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              {selectedMedia ? (
                <motion.div
                  key={selectedMedia.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-medium">{selectedMedia.title}</h2>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getMediaTypeIcon(selectedMedia.mediaType)}
                        <span className="capitalize">{selectedMedia.mediaType}</span>
                      </Badge>
                    </div>
                    
                    {selectedMedia.description && (
                      <p className="text-muted-foreground mb-6">{selectedMedia.description}</p>
                    )}
                    
                    <div className="mb-8">
                      {renderMediaContent(selectedMedia)}
                    </div>
                  </div>
                  
                  <CommentSection 
                    comments={comments}
                    mediaItemId={selectedMedia.id}
                    onAddComment={handleAddComment}
                  />
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">
                    {project.mediaItems.length > 0 
                      ? 'Select a media item to view its details' 
                      : 'No media items available in this project'}
                  </p>
                </div>
              )}
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
