import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { initializeSmartPlatform } from "./utils/smartPlatform";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Catalog from "./pages/Catalog";
import Categories from "./pages/Categories";
import Pricing from "./pages/Pricing";
import Creators from "./pages/Creators";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Subscribe from "./pages/Subscribe";
import BetweenHeavenHell from "./pages/BetweenHeavenHell";
import Dashboard from "./pages/Dashboard";
import Series from "./pages/Series";
import Category from "./pages/Category";
import CreatorPortal from "./pages/CreatorPortal";
import CreatorLogin from "./pages/CreatorLogin";
import CreatorPayments from "./pages/CreatorPayments";
import ContentCreator from "./pages/ContentCreator";
import SmartDashboard from "./pages/SmartDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CreatorTerms from "./pages/CreatorTerms";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

// Initialize smart platform
initializeSmartPlatform();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Rotas públicas */}
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/creators" element={<Creators />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/subscribe" element={<Subscribe />} />

            {/* Rotas protegidas - Assinantes */}
            <Route
              path="/between-heaven-hell"
              element={
                <ProtectedRoute allowedRoles={["subscriber"]} requireSubscription={true}>
                  <BetweenHeavenHell />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["subscriber", "creator", "admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/series"
              element={
                <ProtectedRoute allowedRoles={["subscriber"]} requireSubscription={true}>
                  <Series />
                </ProtectedRoute>
              }
            />
            <Route
              path="/category/:categoryId"
              element={
                <ProtectedRoute allowedRoles={["subscriber"]} requireSubscription={true}>
                  <Category />
                </ProtectedRoute>
              }
            />

            {/* Rotas protegidas - Criadores */}
            <Route
              path="/creator-portal"
              element={
                <ProtectedRoute allowedRoles={["creator"]} requireApproval={true}>
                  <CreatorPortal />
                </ProtectedRoute>
              }
            />
            <Route path="/creator-login" element={<CreatorLogin />} />
            <Route
              path="/creator-payments"
              element={
                <ProtectedRoute allowedRoles={["creator"]} requireApproval={true}>
                  <CreatorPayments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/content-creator"
              element={
                <ProtectedRoute allowedRoles={["creator"]} requireApproval={true}>
                  <ContentCreator />
                </ProtectedRoute>
              }
            />

            {/* Rotas protegidas - Admin */}
            <Route
              path="/smart-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SmartDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/creator-terms" element={<CreatorTerms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
