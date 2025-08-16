import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { initializeSmartPlatform } from "./utils/smartPlatform";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Catalog from "./pages/Catalog";
import Categories from "./pages/Categories";
import Pricing from "./pages/Pricing";
import Creators from "./pages/Creators";
import Login from "./pages/Login";
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

const queryClient = new QueryClient();

// Initialize smart platform
initializeSmartPlatform();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/login" element={<Login />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/between-heaven-hell" element={<BetweenHeavenHell />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/series" element={<Series />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route path="/creator-portal" element={<CreatorPortal />} />
          <Route path="/creator-login" element={<CreatorLogin />} />
          <Route path="/creator-payments" element={<CreatorPayments />} />
          <Route path="/content-creator" element={<ContentCreator />} />
          <Route path="/smart-dashboard" element={<SmartDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
