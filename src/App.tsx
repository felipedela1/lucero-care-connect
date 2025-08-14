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
import AdminAvailability from "./pages/AdminAvailability";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import LoginScreen from "./pages/LoginScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* LoginScreen en la raíz */}
            <Route path="/" element={<LoginScreen />} />

            {/* Página principal en /inicio */}
            <Route
              path="/inicio"
              element={
                <ProtectedRoute allow={["user", "guest"]}>
                  <Layout>
                    <Index />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Otras rutas */}
            <Route
              path="/sobre-mi"
              element={
                <ProtectedRoute allow={["user", "guest"]}>
                  <Layout>
                    <About />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/experiencia"
              element={
                <ProtectedRoute allow={["user", "guest"]}>
                  <Layout>
                    <Experience />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/referencias"
              element={
                <ProtectedRoute allow={["user", "guest"]}>
                  <Layout>
                    <Reviews />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservas"
              element={
                <ProtectedRoute allow={["user","guest"]}>
                  <Layout>
                    <Booking />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tarifas-faq"
              element={
                <ProtectedRoute allow={["user", "guest"]}>
                  <Layout>
                    <PricingFaq />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contacto"
              element={
                <ProtectedRoute allow={["user", "guest"]}>
                  <Layout>
                    <Contact />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/panel"
              element={
                <ProtectedRoute allow={["user"]}>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-availability"
              element={
                <ProtectedRoute allow={["admin", "guest"]}>
                  <Layout>
                    <AdminAvailability />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Ruta de captura */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
