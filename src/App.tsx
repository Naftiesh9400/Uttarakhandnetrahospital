import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import WhyNetra from "./pages/WhyNetra";
import Services from "./pages/Services";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminServices from "./pages/admin/AdminServices";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminFeatures from "./pages/admin/AdminFeatures";
import AdminSEO from "./pages/admin/AdminSEO";
import AdminHomeSettings from "./pages/admin/AdminHomeSettings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInstaReels from "./pages/admin/AdminInstaReels";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/why-netra" element={<WhyNetra />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment" element={<Appointment />} />
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
          <Route path="/admin/testimonials" element={<AdminTestimonials />} />
          <Route path="/admin/features" element={<AdminFeatures />} />
          <Route path="/admin/seo" element={<AdminSEO />} />
          <Route path="/admin/home-settings" element={<AdminHomeSettings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/reels" element={<AdminInstaReels />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
