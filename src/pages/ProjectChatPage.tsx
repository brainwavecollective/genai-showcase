
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProjectChatContainer } from '@/components/project-chat/ProjectChatContainer';

const ProjectChatPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <ProjectChatContainer />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectChatPage;
