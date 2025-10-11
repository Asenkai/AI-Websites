import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import OurWork from "./pages/OurWork";
import CauseDetail from "./pages/CauseDetail";
import Impact from "./pages/Impact";
import Donate from "./pages/Donate";
import CSRPartnership from "./pages/CSRPartnership";
import Volunteer from "./pages/Volunteer";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { SessionProvider } from "./contexts/SessionContext";
import { AdminLayout } from "./components/layout/AdminLayout";
import { GoogleTagManager } from "./components/integrations/GoogleTagManager";
import { AnalyticsTracker } from "./components/integrations/AnalyticsTracker";
import { MetaPixel } from "./components/integrations/MetaPixel";

// Admin Content Pages
import NavigationMenuPage from "./pages/admin/content/NavigationMenuPage";
import CausesPage from "./pages/admin/content/CausesPage";
import HomeContentPage from "./pages/admin/content/HomeContentPage";
import AboutContentPage from "./pages/admin/content/AboutContentPage";
import OurWorkContentPage from "./pages/admin/content/OurWorkContentPage";
import ImpactContentPage from "./pages/admin/content/ImpactContentPage";
import DonateContentPage from "./pages/admin/content/DonateContentPage";
import VolunteerContentPage from "./pages/admin/content/VolunteerContentPage";
import CSRPartnershipContentPage from "./pages/admin/content/CSRPartnershipContentPage";
import ContactContentPage from "./pages/admin/content/ContactContentPage";
import DonorManagementPage from "./pages/admin/donors/DonorManagementPage";
import MISDashboard from "./pages/admin/MISDashboard"; // Import the new MIS Dashboard

// Admin Settings Pages
import GoogleTagPage from "./pages/admin/settings/GoogleTagPage";
import RazorpaySettingsPage from "./pages/admin/settings/RazorpaySettingsPage";
import MetaPixelPage from "./pages/admin/settings/MetaPixelPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <TooltipProvider>
        <HelmetProvider>
          <GoogleTagManager />
          <MetaPixel />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnalyticsTracker />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/our-work" element={<OurWork />} />
                <Route path="/our-work/:causeId" element={<CauseDetail />} />
                <Route path="/impact" element={<Impact />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/csr-partnership" element={<CSRPartnership />} />
                <Route path="/volunteer" element={<Volunteer />} />
                <Route path="/contact" element={<Contact />} />
              </Route>
              
              {/* Routes without the main layout */}
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes with AdminLayout */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                } 
              >
                <Route index element={<AdminDashboard />} />
                <Route path="mis-dashboard" element={<MISDashboard />} /> {/* New MIS Dashboard Route */}
                <Route path="navigation-menu" element={<NavigationMenuPage />} />
                <Route path="causes" element={<CausesPage />} />
                <Route path="donors" element={<DonorManagementPage />} />
                <Route path="content/home" element={<HomeContentPage />} />
                <Route path="content/about" element={<AboutContentPage />} />
                <Route path="content/our-work" element={<OurWorkContentPage />} />
                <Route path="content/impact" element={<ImpactContentPage />} />
                <Route path="content/donate" element={<DonateContentPage />} />
                <Route path="content/volunteer" element={<VolunteerContentPage />} />
                <Route path="content/csr-partnership" element={<CSRPartnershipContentPage />} />
                <Route path="content/contact" element={<ContactContentPage />} />
                <Route path="settings/google-tag" element={<GoogleTagPage />} />
                <Route path="settings/meta-pixel" element={<MetaPixelPage />} />
                <Route path="settings/razorpay" element={<RazorpaySettingsPage />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </HelmetProvider>
      </TooltipProvider>
    </SessionProvider>
  </QueryClientProvider>
);

export default App;