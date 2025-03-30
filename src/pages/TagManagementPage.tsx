
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TagManagement } from '@/components/admin/TagManagement';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const TagManagementPage = () => {
  const { isAdmin, isAuthenticated, isInitializing } = useAuth();
  
  // Show loading state until auth is initialized
  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // Redirect non-admins
  if (!isInitializing && (!isAuthenticated || !isAdmin)) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 container max-w-4xl mx-auto px-4">
        <TagManagement />
      </main>
      
      <Footer />
    </div>
  );
};

export default TagManagementPage;
