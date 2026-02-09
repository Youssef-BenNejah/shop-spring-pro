import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";

// Storefront
import Home from "@/pages/storefront/Home";
import Catalog from "@/pages/storefront/Catalog";
import ProductDetail from "@/pages/storefront/ProductDetail";
import CartPage from "@/pages/storefront/CartPage";
import Checkout from "@/pages/storefront/Checkout";
import Auth from "@/pages/storefront/Auth";
import About from "@/pages/storefront/About";
import Contact from "@/pages/storefront/Contact";
import FAQ from "@/pages/storefront/FAQ";

// Store Admin
import Dashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminOrders from "@/pages/admin/Orders";
import Customers from "@/pages/admin/Customers";
import Marketing from "@/pages/admin/Marketing";
import Analytics from "@/pages/admin/Analytics";
import Settings from "@/pages/admin/Settings";

// Platform (SaaS Landing)
import LandingHome from "@/pages/platform/LandingHome";
import Pricing from "@/pages/platform/Pricing";
import Features from "@/pages/platform/Features";
import Templates from "@/pages/platform/Templates";
import ContactSales from "@/pages/platform/ContactSales";

// Super Admin
import Overview from "@/pages/superadmin/Overview";
import Stores from "@/pages/superadmin/Stores";
import Plans from "@/pages/superadmin/Plans";
import PlatformBilling from "@/pages/superadmin/PlatformBilling";
import FeatureFlags from "@/pages/superadmin/FeatureFlags";
import AuditLogs from "@/pages/superadmin/AuditLogs";

// Onboarding
import StoreOnboarding from "@/pages/onboarding/StoreOnboarding";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Storefront */}
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />

            {/* Store Admin */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/marketing" element={<Marketing />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/settings" element={<Settings />} />

            {/* Platform SaaS Landing */}
            <Route path="/platform" element={<LandingHome />} />
            <Route path="/platform/pricing" element={<Pricing />} />
            <Route path="/platform/features" element={<Features />} />
            <Route path="/platform/templates" element={<Templates />} />
            <Route path="/platform/contact-sales" element={<ContactSales />} />

            {/* Super Admin */}
            <Route path="/super-admin" element={<Overview />} />
            <Route path="/super-admin/stores" element={<Stores />} />
            <Route path="/super-admin/plans" element={<Plans />} />
            <Route path="/super-admin/billing" element={<PlatformBilling />} />
            <Route path="/super-admin/feature-flags" element={<FeatureFlags />} />
            <Route path="/super-admin/audit-logs" element={<AuditLogs />} />

            {/* Onboarding */}
            <Route path="/onboarding" element={<StoreOnboarding />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
