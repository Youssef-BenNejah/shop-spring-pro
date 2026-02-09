export type StoreStatus = "active" | "suspended" | "trial" | "cancelled";
export type StoreType = "fashion" | "electronics" | "cosmetics" | "grocery" | "restaurant" | "digital" | "services" | "general";
export type PlanTier = "free" | "starter" | "pro" | "business" | "enterprise";
export type BillingCycle = "monthly" | "yearly";
export type AuditAction = "store_created" | "store_suspended" | "store_reactivated" | "plan_changed" | "impersonation" | "billing_change" | "feature_flag_changed" | "user_created" | "settings_changed";

export interface PlanLimits {
  maxProducts: number;
  maxMonthlyOrders: number;
  maxStaffAccounts: number;
  customDomain: boolean;
  advancedAnalytics: boolean;
  abandonedCart: boolean;
  advancedPromotions: boolean;
  multiWarehouse: boolean;
  apiAccess: boolean;
  webhooks: boolean;
  invoiceCustomization: "basic" | "advanced";
  automatedEmails: boolean;
  prioritySupport: boolean;
}

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  limits: PlanLimits;
  popular?: boolean;
  trialDays: number;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  type: StoreType;
  status: StoreStatus;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  planId: string;
  planTier: PlanTier;
  domain?: string;
  subdomain: string;
  branding: StoreBranding;
  createdAt: string;
  trialEndsAt?: string;
  productCount: number;
  orderCount: number;
  revenue: number;
  mrr: number;
}

export interface StoreBranding {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  stylePreset: "minimal" | "bold" | "luxury" | "playful";
  fontFamily?: string;
}

export interface Subscription {
  id: string;
  storeId: string;
  storeName: string;
  planId: string;
  planName: string;
  planTier: PlanTier;
  status: "active" | "trialing" | "past_due" | "cancelled" | "paused";
  billingCycle: BillingCycle;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amount: number;
  currency: string;
}

export interface PlatformInvoice {
  id: string;
  storeId: string;
  storeName: string;
  amount: number;
  status: "paid" | "pending" | "failed" | "refunded";
  createdAt: string;
  paidAt?: string;
  invoiceNumber: string;
}

export interface AuditLog {
  id: string;
  action: AuditAction;
  actorId: string;
  actorName: string;
  actorRole: "super_admin" | "store_admin";
  targetType: "store" | "plan" | "user" | "feature" | "billing";
  targetId: string;
  targetName: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabledForPlans: PlanTier[];
  enabledForStores: string[];
  globallyEnabled: boolean;
}

export interface StoreTemplate {
  type: StoreType;
  name: string;
  description: string;
  icon: string;
  defaultCategories: string[];
  defaultAttributes: string[];
  previewImage?: string;
}
