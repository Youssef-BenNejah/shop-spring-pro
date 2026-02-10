import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

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
import Account from "@/pages/storefront/Account";
import Wishlist from "@/pages/storefront/Wishlist";

// Store Admin
import Dashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminCategories from "@/pages/admin/Categories";
import AdminOrders from "@/pages/admin/Orders";
import Invoices from "@/pages/admin/Invoices";
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
import PlatformSettings from "@/pages/superadmin/PlatformSettings";

// Onboarding
import StoreOnboarding from "@/pages/onboarding/StoreOnboarding";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
      <WishlistProvider>
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
            <Route path="/account" element={<Account />} />
            <Route path="/wishlist" element={<Wishlist />} />

            {/* Store Admin */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/invoices" element={<Invoices />} />
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
            <Route path="/super-admin/settings" element={<PlatformSettings />} />

            {/* Onboarding */}
            <Route path="/onboarding" element={<StoreOnboarding />} />

          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
