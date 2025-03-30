
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import ShowcasePage from "./pages/ShowcasePage";
import NotFound from "./pages/NotFound";
import ManageUsersPage from "./pages/ManageUsersPage";
import UserProfilePage from "./pages/UserProfilePage";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import ChatPage from "./pages/ChatPage";
import ProjectChatPage from "./pages/ProjectChatPage";
import DashboardPage from "./pages/DashboardPage";
import NewProjectPage from "./pages/NewProjectPage";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/project/:id" element={<ShowcasePage />} />
              <Route path="/project/new" element={<NewProjectPage />} />
              <Route path="/project/:id/chat" element={<ChatPage />} />
              <Route path="/chat" element={<ProjectChatPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/manage-users" element={<ManageUsersPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/terms" element={<TermsPage />} />
              {/* Redirect /login to home page since there's no actual login page route */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
