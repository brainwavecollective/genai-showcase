
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';

const TermsPage = () => {
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
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">Terms and Conditions</h1>
            <p className="text-sm text-muted-foreground mb-8">Last Updated: March 2025</p>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              By using this platform, you agree to the following:
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Independent Platform</h3>
                <p className="text-muted-foreground leading-relaxed">
                  This website is independently maintained and not affiliated with CU Boulder. We may discontinue or stop maintaining it at any time.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">No Guarantees</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The platform is provided as is, with no warranties or guarantees regarding availability, security, or content accuracy.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">User Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you upload content, you retain ownership but grant us unrestricted rights to display and use it as we see fit. 
                  We are not responsible for any claims related to uploaded content.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">No Moderation, Full Discretion</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We do not review or moderate content but reserve the right to remove or restrict anything, at any time, for any reason.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">User Conduct</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You agree not to upload anything illegal, harmful, or objectionable.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Limited Liability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We are not liable for any issues, damages, or disputes arising from the use of this platform.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Account Access</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may restrict or terminate access to anyone, at our sole discretion, without notice.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Changes to Terms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  These terms may change at any time without notice. Continued use of the platform means you accept the updated terms.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <p className="text-muted-foreground leading-relaxed">
                  <a href="mailto:daniel@brainwavecollective.ai" className="text-cu-gold hover:underline">daniel@brainwavecollective.ai</a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsPage;
