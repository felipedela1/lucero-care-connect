import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AdminAvailability from "./pages/AdminAvailability";
import RegistroScreen from "@/pages/Registro";
import LoginScreen from "@/pages/LoginScreen"; // Asegúrate de tener esta importación


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Ruta de login */}
            <Route path="/login" element={<LoginScreen />} />

            {/* Redirect root to /inicio */}
            <Route path="/" element={<Navigate to="/inicio" replace />} />

            {/* Página pública de registro */}
            <Route path="/registro" element={<RegistroScreen />} />

            {/* Página principal en /inicio */}
            <Route path="/inicio" element={<Layout><Index /></Layout>} />

            {/* Otras rutas públicas */}
            <Route path="/sobre-mi" element={<Layout><About /></Layout>} />
            <Route path="/experiencia" element={<Layout><Experience /></Layout>} />
            <Route path="/referencias" element={<Layout><Reviews /></Layout>} />
            <Route path="/reservas" element={<Layout><Booking /></Layout>} />
            <Route path="/tarifas-faq" element={<Layout><PricingFaq /></Layout>} />
            <Route path="/contacto" element={<Layout><Contact /></Layout>} />
            <Route path="/panel" element={<Layout><Dashboard /></Layout>} />
            <Route path="/admin-availability" element={<Layout><AdminAvailability /></Layout>} />

            {/* Ruta de captura */}
            <Route path="*" element={<Navigate to="/inicio" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
