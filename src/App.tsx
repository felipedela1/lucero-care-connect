import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Reviews from "./pages/Reviews";
import Booking from "./pages/Booking";
import PricingFaq from "./pages/PricingFaq";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sobre-mi" element={<About />} />
              <Route path="/experiencia" element={<Experience />} />
              <Route path="/referencias" element={<Reviews />} />
              <Route path="/reservas" element={<Booking />} />
              <Route path="/tarifas-faq" element={<PricingFaq />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/panel" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
