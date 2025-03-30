
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft } from 'lucide-react';
import { ShowcaseLoading } from '@/components/showcase/ShowcaseLoading';
import { ShowcaseError } from '@/components/showcase/ShowcaseError';
import { ShowcaseNotFound } from '@/components/showcase/ShowcaseNotFound';
import { ProjectHeader } from '@/components/showcase/ProjectHeader';
import { ShowcaseContent } from '@/components/showcase/ShowcaseContent';
import { FloatingAIAssistant } from '@/components/showcase/FloatingAIAssistant';
import { useShowcaseData } from '@/hooks/useShowcaseData';
import { formatDate } from '@/utils/dateUtils';

const ShowcasePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    project,
    projectTags,
    creator,
    selectedMedia,
    mediaItems,
    comments,
    isLoading,
    commentsLoading,
    error,
    canEdit,
    handleMediaSelect,
    handleAddComment,
    handleAddMedia,
    handlePrivacyToggle
  } = useShowcaseData(id);

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
          <ShowcaseContent
            project={project}
            selectedMedia={selectedMedia}
            mediaItems={mediaItems}
            comments={comments}
            canEdit={canEdit}
            onMediaSelect={handleMediaSelect}
            onAddComment={handleAddComment}
            onMediaAdded={handleAddMedia}
            isLoading={isLoading}
            commentsLoading={commentsLoading}
          />
          
          {/* Last updated date at the bottom */}
          <div className="text-center mt-16 text-sm text-muted-foreground flex items-center justify-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Last updated {formatDate(project.updated_at || '')}</span>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Floating AI Assistant */}
      <FloatingAIAssistant projectId={project.id} />
    </div>
  );
};

export default ShowcasePage;
