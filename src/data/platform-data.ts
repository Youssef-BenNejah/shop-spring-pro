import { Plan, Store, AuditLog, FeatureFlag, Subscription, PlatformInvoice, StoreTemplate } from "@/types/platform";

export const plans: Plan[] = [
  {
    id: "plan_free", name: "Free", tier: "free", description: "Get started with basic features",
    monthlyPrice: 0, yearlyPrice: 0, trialDays: 0,
    limits: { maxProducts: 10, maxMonthlyOrders: 25, maxStaffAccounts: 1, customDomain: false, advancedAnalytics: false, abandonedCart: false, advancedPromotions: false, multiWarehouse: false, apiAccess: false, webhooks: false, invoiceCustomization: "basic", automatedEmails: false, prioritySupport: false },
  },
  {
    id: "plan_starter", name: "Starter", tier: "starter", description: "Perfect for small businesses",
    monthlyPrice: 29, yearlyPrice: 290, trialDays: 14,
    limits: { maxProducts: 100, maxMonthlyOrders: 500, maxStaffAccounts: 3, customDomain: false, advancedAnalytics: false, abandonedCart: true, advancedPromotions: false, multiWarehouse: false, apiAccess: false, webhooks: false, invoiceCustomization: "basic", automatedEmails: true, prioritySupport: false },
  },
  {
    id: "plan_pro", name: "Pro", tier: "pro", description: "Scale your growing business", popular: true,
    monthlyPrice: 79, yearlyPrice: 790, trialDays: 14,
    limits: { maxProducts: 1000, maxMonthlyOrders: 5000, maxStaffAccounts: 10, customDomain: true, advancedAnalytics: true, abandonedCart: true, advancedPromotions: true, multiWarehouse: false, apiAccess: true, webhooks: true, invoiceCustomization: "advanced", automatedEmails: true, prioritySupport: false },
  },
  {
    id: "plan_business", name: "Business", tier: "business", description: "Advanced tools for large operations",
    monthlyPrice: 199, yearlyPrice: 1990, trialDays: 14,
    limits: { maxProducts: 10000, maxMonthlyOrders: 25000, maxStaffAccounts: 25, customDomain: true, advancedAnalytics: true, abandonedCart: true, advancedPromotions: true, multiWarehouse: true, apiAccess: true, webhooks: true, invoiceCustomization: "advanced", automatedEmails: true, prioritySupport: true },
  },
  {
    id: "plan_enterprise", name: "Enterprise", tier: "enterprise", description: "Custom solutions for enterprise",
    monthlyPrice: 499, yearlyPrice: 4990, trialDays: 30,
    limits: { maxProducts: -1, maxMonthlyOrders: -1, maxStaffAccounts: -1, customDomain: true, advancedAnalytics: true, abandonedCart: true, advancedPromotions: true, multiWarehouse: true, apiAccess: true, webhooks: true, invoiceCustomization: "advanced", automatedEmails: true, prioritySupport: true },
  },
];

export const sampleStores: Store[] = [
  {
    id: "store_1", name: "LUXE Fashion", slug: "luxe-fashion", type: "fashion", status: "active",
    ownerId: "u1", ownerName: "Sarah Laurent", ownerEmail: "sarah@luxefashion.com",
    planId: "plan_pro", planTier: "pro", subdomain: "luxe-fashion", domain: "luxefashion.com",
    branding: { primaryColor: "#1a1a2e", secondaryColor: "#d4a574", stylePreset: "luxury" },
    createdAt: "2025-06-15", productCount: 248, orderCount: 1847, revenue: 285400, mrr: 79,
  },
  {
    id: "store_2", name: "TechZone", slug: "techzone", type: "electronics", status: "active",
    ownerId: "u2", ownerName: "James Park", ownerEmail: "james@techzone.io",
    planId: "plan_business", planTier: "business", subdomain: "techzone", domain: "techzone.io",
    branding: { primaryColor: "#0f172a", secondaryColor: "#3b82f6", stylePreset: "bold" },
    createdAt: "2025-04-20", productCount: 892, orderCount: 5623, revenue: 1245000, mrr: 199,
  },
  {
    id: "store_3", name: "Bloom Beauty", slug: "bloom-beauty", type: "cosmetics", status: "trial",
    ownerId: "u3", ownerName: "Emma Rose", ownerEmail: "emma@bloombeauty.com",
    planId: "plan_starter", planTier: "starter", subdomain: "bloom-beauty", trialEndsAt: "2026-02-23",
    branding: { primaryColor: "#4a1942", secondaryColor: "#e8a0bf", stylePreset: "playful" },
    createdAt: "2026-02-09", productCount: 34, orderCount: 12, revenue: 890, mrr: 29,
  },
  {
    id: "store_4", name: "Fresh Bites", slug: "fresh-bites", type: "grocery", status: "active",
    ownerId: "u4", ownerName: "Carlos Mendez", ownerEmail: "carlos@freshbites.co",
    planId: "plan_pro", planTier: "pro", subdomain: "fresh-bites",
    branding: { primaryColor: "#1b4332", secondaryColor: "#95d5b2", stylePreset: "minimal" },
    createdAt: "2025-09-01", productCount: 567, orderCount: 8934, revenue: 567800, mrr: 79,
  },
  {
    id: "store_5", name: "Digital Hub", slug: "digital-hub", type: "digital", status: "suspended",
    ownerId: "u5", ownerName: "Alex Kim", ownerEmail: "alex@digitalhub.dev",
    planId: "plan_starter", planTier: "starter", subdomain: "digital-hub",
    branding: { primaryColor: "#1e1e1e", secondaryColor: "#facc15", stylePreset: "bold" },
    createdAt: "2025-11-10", productCount: 23, orderCount: 156, revenue: 4500, mrr: 0,
  },
  {
    id: "store_6", name: "Casa Bella", slug: "casa-bella", type: "general", status: "active",
    ownerId: "u6", ownerName: "Maria Rossi", ownerEmail: "maria@casabella.com",
    planId: "plan_free", planTier: "free", subdomain: "casa-bella",
    branding: { primaryColor: "#292524", secondaryColor: "#a8a29e", stylePreset: "minimal" },
    createdAt: "2026-01-05", productCount: 8, orderCount: 45, revenue: 1200, mrr: 0,
  },
];

export const sampleAuditLogs: AuditLog[] = [
  { id: "al1", action: "store_created", actorId: "sa1", actorName: "Super Admin", actorRole: "super_admin", targetType: "store", targetId: "store_3", targetName: "Bloom Beauty", details: "New store created via onboarding wizard", timestamp: "2026-02-09T10:30:00Z", ipAddress: "192.168.1.1" },
  { id: "al2", action: "plan_changed", actorId: "u2", actorName: "James Park", actorRole: "store_admin", targetType: "store", targetId: "store_2", targetName: "TechZone", details: "Upgraded from Pro to Business plan", timestamp: "2026-02-08T14:22:00Z", ipAddress: "10.0.0.5" },
  { id: "al3", action: "store_suspended", actorId: "sa1", actorName: "Super Admin", actorRole: "super_admin", targetType: "store", targetId: "store_5", targetName: "Digital Hub", details: "Suspended due to payment failure after 3 retries", timestamp: "2026-02-07T09:15:00Z", ipAddress: "192.168.1.1" },
  { id: "al4", action: "impersonation", actorId: "sa1", actorName: "Super Admin", actorRole: "super_admin", targetType: "user", targetId: "u1", targetName: "Sarah Laurent", details: "Impersonated store admin for debugging", timestamp: "2026-02-06T16:45:00Z", ipAddress: "192.168.1.1" },
  { id: "al5", action: "feature_flag_changed", actorId: "sa1", actorName: "Super Admin", actorRole: "super_admin", targetType: "feature", targetId: "ff2", targetName: "AI Product Descriptions", details: "Enabled for Pro and above plans", timestamp: "2026-02-05T11:00:00Z", ipAddress: "192.168.1.1" },
  { id: "al6", action: "billing_change", actorId: "u4", actorName: "Carlos Mendez", actorRole: "store_admin", targetType: "billing", targetId: "sub_4", targetName: "Fresh Bites subscription", details: "Switched from monthly to yearly billing", timestamp: "2026-02-04T13:30:00Z", ipAddress: "10.0.0.12" },
  { id: "al7", action: "store_reactivated", actorId: "sa1", actorName: "Super Admin", actorRole: "super_admin", targetType: "store", targetId: "store_5", targetName: "Digital Hub", details: "Store reactivated after payment resolved", timestamp: "2026-02-03T10:00:00Z", ipAddress: "192.168.1.1" },
];

export const sampleFeatureFlags: FeatureFlag[] = [
  { id: "ff1", name: "Abandoned Cart Recovery", key: "abandoned_cart", description: "Send automated emails to recover abandoned carts", enabledForPlans: ["starter", "pro", "business", "enterprise"], enabledForStores: [], globallyEnabled: true },
  { id: "ff2", name: "AI Product Descriptions", key: "ai_descriptions", description: "Generate product descriptions using AI", enabledForPlans: ["pro", "business", "enterprise"], enabledForStores: [], globallyEnabled: true },
  { id: "ff3", name: "Multi-Warehouse", key: "multi_warehouse", description: "Manage inventory across multiple warehouses", enabledForPlans: ["business", "enterprise"], enabledForStores: [], globallyEnabled: true },
  { id: "ff4", name: "Advanced Analytics", key: "advanced_analytics", description: "Detailed sales reports, cohort analysis, and forecasting", enabledForPlans: ["pro", "business", "enterprise"], enabledForStores: [], globallyEnabled: true },
  { id: "ff5", name: "Custom Checkout", key: "custom_checkout", description: "Fully customizable checkout experience", enabledForPlans: ["business", "enterprise"], enabledForStores: ["store_1"], globallyEnabled: false },
  { id: "ff6", name: "Webhook Integrations", key: "webhooks", description: "Real-time event notifications via webhooks", enabledForPlans: ["pro", "business", "enterprise"], enabledForStores: [], globallyEnabled: true },
  { id: "ff7", name: "API Access", key: "api_access", description: "RESTful API for programmatic store management", enabledForPlans: ["pro", "business", "enterprise"], enabledForStores: [], globallyEnabled: true },
];

export const sampleSubscriptions: Subscription[] = [
  { id: "sub_1", storeId: "store_1", storeName: "LUXE Fashion", planId: "plan_pro", planName: "Pro", planTier: "pro", status: "active", billingCycle: "monthly", currentPeriodStart: "2026-02-01", currentPeriodEnd: "2026-03-01", amount: 79, currency: "USD" },
  { id: "sub_2", storeId: "store_2", storeName: "TechZone", planId: "plan_business", planName: "Business", planTier: "business", status: "active", billingCycle: "yearly", currentPeriodStart: "2025-12-20", currentPeriodEnd: "2026-12-20", amount: 1990, currency: "USD" },
  { id: "sub_3", storeId: "store_3", storeName: "Bloom Beauty", planId: "plan_starter", planName: "Starter", planTier: "starter", status: "trialing", billingCycle: "monthly", currentPeriodStart: "2026-02-09", currentPeriodEnd: "2026-02-23", amount: 29, currency: "USD" },
  { id: "sub_4", storeId: "store_4", storeName: "Fresh Bites", planId: "plan_pro", planName: "Pro", planTier: "pro", status: "active", billingCycle: "yearly", currentPeriodStart: "2025-09-01", currentPeriodEnd: "2026-09-01", amount: 790, currency: "USD" },
  { id: "sub_5", storeId: "store_5", storeName: "Digital Hub", planId: "plan_starter", planName: "Starter", planTier: "starter", status: "cancelled", billingCycle: "monthly", currentPeriodStart: "2026-01-10", currentPeriodEnd: "2026-02-10", amount: 29, currency: "USD" },
];

export const samplePlatformInvoices: PlatformInvoice[] = [
  { id: "inv_1", storeId: "store_1", storeName: "LUXE Fashion", amount: 79, status: "paid", createdAt: "2026-02-01", paidAt: "2026-02-01", invoiceNumber: "PLT-2026-000045" },
  { id: "inv_2", storeId: "store_2", storeName: "TechZone", amount: 1990, status: "paid", createdAt: "2025-12-20", paidAt: "2025-12-20", invoiceNumber: "PLT-2025-000039" },
  { id: "inv_3", storeId: "store_4", storeName: "Fresh Bites", amount: 790, status: "paid", createdAt: "2025-09-01", paidAt: "2025-09-01", invoiceNumber: "PLT-2025-000028" },
  { id: "inv_4", storeId: "store_5", storeName: "Digital Hub", amount: 29, status: "failed", createdAt: "2026-02-10", invoiceNumber: "PLT-2026-000048" },
  { id: "inv_5", storeId: "store_3", storeName: "Bloom Beauty", amount: 29, status: "pending", createdAt: "2026-02-23", invoiceNumber: "PLT-2026-000050" },
];

export const storeTemplates: StoreTemplate[] = [
  { type: "fashion", name: "Fashion & Apparel", description: "Clothing, shoes, and accessories with size/color variants", icon: "👗", defaultCategories: ["Women", "Men", "Kids", "Accessories", "Shoes", "Sale"], defaultAttributes: ["Size", "Color", "Material", "Brand"] },
  { type: "electronics", name: "Electronics & Tech", description: "Gadgets, devices, and tech accessories with specs", icon: "💻", defaultCategories: ["Phones", "Laptops", "Audio", "Accessories", "Gaming", "Wearables"], defaultAttributes: ["Brand", "Storage", "RAM", "Screen Size", "Color"] },
  { type: "cosmetics", name: "Beauty & Cosmetics", description: "Skincare, makeup, and beauty products", icon: "💄", defaultCategories: ["Skincare", "Makeup", "Fragrance", "Hair Care", "Body Care", "Tools"], defaultAttributes: ["Skin Type", "Shade", "Size", "Ingredient"] },
  { type: "grocery", name: "Grocery & Food", description: "Fresh food, pantry items, and beverages", icon: "🛒", defaultCategories: ["Fresh Produce", "Dairy", "Bakery", "Beverages", "Snacks", "Frozen"], defaultAttributes: ["Weight", "Organic", "Allergens", "Origin"] },
  { type: "restaurant", name: "Restaurant & Café", description: "Online ordering for restaurants and cafés", icon: "🍽️", defaultCategories: ["Appetizers", "Main Course", "Desserts", "Beverages", "Specials"], defaultAttributes: ["Spice Level", "Dietary", "Portion"] },
  { type: "digital", name: "Digital Products", description: "Software, courses, ebooks, and digital downloads", icon: "📦", defaultCategories: ["Software", "Courses", "E-books", "Templates", "Music", "Graphics"], defaultAttributes: ["Format", "License", "Version"] },
  { type: "services", name: "Services & Booking", description: "Professional services and appointment booking", icon: "🔧", defaultCategories: ["Consulting", "Design", "Development", "Marketing", "Support"], defaultAttributes: ["Duration", "Level", "Delivery"] },
  { type: "general", name: "General Store", description: "A flexible store for any type of product", icon: "🏪", defaultCategories: ["Featured", "New Arrivals", "Best Sellers", "Sale"], defaultAttributes: ["Size", "Color", "Brand"] },
];

export const platformStats = {
  totalStores: sampleStores.length,
  activeStores: sampleStores.filter(s => s.status === "active").length,
  trialStores: sampleStores.filter(s => s.status === "trial").length,
  totalRevenue: sampleStores.reduce((s, st) => s + st.revenue, 0),
  mrr: sampleStores.reduce((s, st) => s + st.mrr, 0),
  arr: sampleStores.reduce((s, st) => s + st.mrr, 0) * 12,
  churnRate: 4.2,
  failedPayments: 1,
  totalOrders: sampleStores.reduce((s, st) => s + st.orderCount, 0),
  totalProducts: sampleStores.reduce((s, st) => s + st.productCount, 0),
};

export const mrrChartData = [
  { month: "Sep", mrr: 158 }, { month: "Oct", mrr: 237 }, { month: "Nov", mrr: 266 },
  { month: "Dec", mrr: 345 }, { month: "Jan", mrr: 357 }, { month: "Feb", mrr: 386 },
];
