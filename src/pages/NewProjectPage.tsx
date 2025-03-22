
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NewProjectForm } from '@/components/project/NewProjectForm';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function NewProjectPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-4xl mx-auto px-4 py-8"
      >
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        </div>
        
        <Separator className="mb-8" />
        
        <NewProjectForm />
      </motion.div>
    </Layout>
  );
}
