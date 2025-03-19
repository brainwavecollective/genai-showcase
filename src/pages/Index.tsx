
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { ProjectSection } from '@/components/home/ProjectSection';
import { projects, tags } from '@/data/mockData';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <HeroSection />
        <ProjectSection projects={projects} tags={tags} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
