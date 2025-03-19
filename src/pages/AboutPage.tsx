
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">About the Showcase</h1>
            
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <AspectRatio ratio={16/9}>
                <img 
                  src="/lovable-uploads/270d895b-0c75-453f-a328-6157826d68ab.png" 
                  alt="View of University of Colorado Boulder with the Flatirons in the background" 
                  className="object-cover w-full h-full" 
                />
              </AspectRatio>
              <p className="text-sm text-muted-foreground italic p-2 bg-card">
                University of Colorado Boulder campus with the iconic Flatirons in the background
              </p>
            </div>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Project Origin</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This showcase platform was developed during a Spring 2025 workshop led by Daniel Ritchie as part of 
                Larissa Schwartz's Generative AI course at the ATLAS Institute, CU Boulder. The platform serves as 
                both a functional showcase and a teaching tool, demonstrating key concepts in web development, user 
                experience design, and content management. The workshop explored innovative approaches to rapid 
                prototyping and development, focusing on the integration of aesthetic and functional elements. 
                This platform was created as a demonstration tool for the workshop to illustrate application 
                development concepts in practice.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Educational Context</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As part of Professor Schwartz's Generative AI curriculum, this project provided students with 
                hands-on experience in:
              </p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
                <li>Collaborative development environments</li>
                <li>User interface design for creative portfolios</li>
                <li>Integration of generative AI components in web applications</li>
                <li>Exploration of iterative design processes using low-code/no-code tools</li>
                <li>Background understanding of vibe coding and related experiences</li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Student Work Usage Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All student projects featured on this platform remain the intellectual property of their respective 
                creators. Students are wholly responsible for the content they upload to this showcase platform. 
                This platform is provided for demonstration purposes of related technologies only, and content is 
                not reviewed for accuracy or appropriateness.
              </p>
              <p className="font-medium mb-4">
                <strong>Important note:</strong> This showcase platform is independently developed and maintained by 
                Daniel Ritchie as an external instructor for the workshop. It is not officially affiliated with or 
                endorsed by the University of Colorado Boulder or the ATLAS Institute.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By submitting work to this platform, students:
              </p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
                <li>Retain full ownership of their intellectual property</li>
                <li>Grant display rights for educational and demonstration purposes</li>
                <li>Acknowledge responsibility for the content they upload</li>
                <li>Have direct control over their content through individual login accounts, including the ability to edit or remove their work at any time</li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For questions regarding this platform, please contact:
              </p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
                <li>Daniel Ritchie: <a href="mailto:daniel@brainwavecollective.ai" className="text-cu-gold hover:underline">daniel@brainwavecollective.ai</a></li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For questions about the Generative AI course at ATLAS Institute, please contact:
              </p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-1">
                <li>Larissa Schwartz: <a href="mailto:Larissa.Schwartz@colorado.edu" className="text-cu-gold hover:underline">Larissa.Schwartz@colorado.edu</a></li>
              </ul>
            </section>
            
            <hr className="my-8 border-t border-border" />
            
            <p className="text-sm text-muted-foreground italic">
              Last updated: March 2025
            </p>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
