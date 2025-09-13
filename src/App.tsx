import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/our-work" element={<OurWork />} />
            <Route path="/our-work/:causeId" element={<CauseDetail />} /> {/* Dynamic route for cause details */}
            <Route path="/impact" element={<Impact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/csr-partnership" element={<CSRPartnership />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;