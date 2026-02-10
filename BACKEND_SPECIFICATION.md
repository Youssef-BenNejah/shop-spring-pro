# MAISON — Multi-Tenant SaaS E-Commerce Platform
## Complete Backend Specification (Spring Boot + MongoDB)

> **Generated from frontend codebase analysis — Feb 2026**
> This document covers ALL entities, fields, enums, REST API endpoints, business rules, and MongoDB collection schemas needed to power the MAISON platform.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [User Roles & Authentication](#2-user-roles--authentication)
3. [MongoDB Collections & Document Schemas](#3-mongodb-collections--document-schemas)
4. [REST API Endpoints](#4-rest-api-endpoints)
5. [Business Rules & Logic](#5-business-rules--logic)
6. [Feature Flags System](#6-feature-flags-system)
7. [Settings & Configuration](#7-settings--configuration)
8. [Internationalization](#8-internationalization)
9. [Payments & Billing](#9-payments--billing)
10. [Analytics & Reporting](#10-analytics--reporting)

---

## 1. Architecture Overview

### Three-Layer System

| Layer | Description | Users |
|-------|-------------|-------|
| **Platform (SaaS)** | Landing pages, pricing, onboarding, super admin | Platform owner / super admins |
| **Store Admin** | Per-store dashboard, products, orders, customers, settings | Store merchants |
| **Storefront** | Customer-facing shop, catalog, cart, checkout | End customers |

### Multi-Tenancy

- Every entity (products, orders, customers, etc.) is scoped by `storeId`
- Stores are resolved via subdomain (`luxe-fashion.maison.app`) or custom domain (`luxefashion.com`)
- All API calls require `storeId` context (resolved from auth token or subdomain header)

### Tech Stack (Backend)

- **Runtime**: Spring Boot 3.x (Java 17+)
- **Database**: MongoDB
- **Auth**: JWT tokens (Spring Security)
- **Payments**: Stripe (Connect for marketplace, direct for SaaS billing)
- **Email**: Configurable (SMTP / SendGrid / AWS SES / Resend)
- **File Storage**: S3-compatible blob storage

---

## 2. User Roles & Authentication

### Roles (Enum: `UserRole`)

```
SUPER_ADMIN    — Platform-level, full access to all stores and settings
STORE_ADMIN    — Owner of a specific store, full access to that store
STORE_STAFF    — Staff member of a store, limited access (future)
CUSTOMER       — End-user of a storefront
```

### Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Customer signup | Public |
| `POST` | `/api/auth/login` | Login (all roles) | Public |
| `POST` | `/api/auth/forgot-password` | Send reset link | Public |
| `POST` | `/api/auth/reset-password` | Reset with token | Public |
| `POST` | `/api/auth/refresh` | Refresh JWT | Auth |
| `GET`  | `/api/auth/me` | Current user profile | Auth |
| `PUT`  | `/api/auth/me` | Update profile | Auth |
| `PUT`  | `/api/auth/me/password` | Change password | Auth |
| `POST` | `/api/auth/logout` | Invalidate token | Auth |

### Auth Entity: `User`

```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "email": "String (required, unique per role scope)",
  "passwordHash": "String (bcrypt)",
  "role": "UserRole (SUPER_ADMIN | STORE_ADMIN | STORE_STAFF | CUSTOMER)",
  "storeId": "String? (null for SUPER_ADMIN, required for others)",
  "avatar": "String? (URL)",
  "phone": "String?",
  "status": "String (active | blocked)",
  "notes": "String?",
  "twoFactorEnabled": "Boolean (default false)",
  "lastLoginAt": "DateTime?",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

**MongoDB Collection**: `users`
**Indexes**: `{ email: 1, storeId: 1 }` (unique), `{ role: 1 }`, `{ storeId: 1 }`

---

## 3. MongoDB Collections & Document Schemas

### 3.1 `stores`

```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "slug": "String (required, unique)",
  "type": "StoreType",
  "status": "StoreStatus",
  "ownerId": "String (ref: users._id)",
  "ownerName": "String",
  "ownerEmail": "String",
  "planId": "String (ref: plans._id)",
  "planTier": "PlanTier",
  "subdomain": "String (required, unique)",
  "domain": "String? (custom domain)",
  "branding": {
    "logo": "String? (URL)",
    "favicon": "String? (URL)",
    "primaryColor": "String (hex)",
    "secondaryColor": "String (hex)",
    "stylePreset": "StylePreset",
    "fontFamily": "String?"
  },
  "settings": {
    "currency": "String (default 'USD')",
    "timezone": "String (default 'UTC')",
    "weightUnit": "String (kg | lb)",
    "taxEnabled": "Boolean (default true)",
    "autoInvoice": "Boolean (default true)",
    "invoicePrefix": "String (default 'INV-{YEAR}-')",
    "paymentTerms": "String (due_on_receipt | net_15 | net_30)",
    "returnWindow": "Number (days, default 30)",
    "restockFee": "Number (percentage, default 0)"
  },
  "stripe": {
    "accountId": "String? (Stripe Connect account)",
    "testMode": "Boolean (default true)",
    "secretKey": "String? (encrypted)",
    "publishableKey": "String?",
    "webhookSecret": "String? (encrypted)"
  },
  "acceptedPaymentMethods": ["String (credit_card | apple_pay | google_pay | paypal | bank_transfer | cod)"],
  "emailNotifications": {
    "onOrder": "Boolean (default true)",
    "onShipment": "Boolean (default true)",
    "onDelivery": "Boolean (default true)",
    "onRefund": "Boolean (default true)",
    "onAbandonedCart": "Boolean (default false)"
  },
  "returnPolicy": {
    "enabled": "Boolean (default true)",
    "windowDays": "Number (default 30)",
    "restockFeePercent": "Number (default 0)",
    "requireApproval": "Boolean (default true)",
    "allowExchanges": "Boolean (default true)"
  },
  "legal": {
    "termsOfService": "String? (HTML)",
    "privacyPolicy": "String? (HTML)",
    "refundPolicy": "String? (HTML)",
    "gdprEnabled": "Boolean (default false)",
    "cookieConsentEnabled": "Boolean (default false)"
  },
  "trialEndsAt": "DateTime?",
  "productCount": "Number (default 0)",
  "orderCount": "Number (default 0)",
  "revenue": "Number (default 0)",
  "mrr": "Number (default 0)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

**Enums**:
- `StoreType`: `fashion | electronics | cosmetics | grocery | restaurant | digital | services | general`
- `StoreStatus`: `active | suspended | trial | cancelled`
- `StylePreset`: `minimal | bold | luxury | playful`
- `PlanTier`: `free | starter | pro | business | enterprise`

**Indexes**: `{ slug: 1 }` (unique), `{ subdomain: 1 }` (unique), `{ domain: 1 }` (sparse unique), `{ ownerId: 1 }`, `{ status: 1 }`

---

### 3.2 `categories`

```json
{
  "_id": "ObjectId",
  "storeId": "String (required, ref: stores._id)",
  "name": "String (required)",
  "slug": "String (required)",
  "description": "String?",
  "productCount": "Number (default 0)",
  "position": "Number (for ordering)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

**Indexes**: `{ storeId: 1, slug: 1 }` (unique), `{ storeId: 1, position: 1 }`

---

### 3.3 `products`

```json
{
  "_id": "ObjectId",
  "storeId": "String (required)",
  "name": "String (required)",
  "slug": "String (required)",
  "description": "String (required)",
  "price": "Number (required, >= 0)",
  "compareAtPrice": "Number? (original price for discount display)",
  "images": ["String (URLs)"],
  "categoryId": "String (ref: categories._id)",
  "categoryName": "String (denormalized)",
  "categorySlug": "String (denormalized)",
  "tags": ["String"],
  "rating": "Number (default 0, 0-5)",
  "reviewCount": "Number (default 0)",
  "inStock": "Boolean (default true)",
  "stockCount": "Number (default 0)",
  "variants": [
    {
      "id": "String",
      "name": "String (e.g. 'Size', 'Color')",
      "type": "VariantType (size | color)",
      "options": ["String (e.g. 'XS', 'S', 'M', 'L', 'XL')"]
    }
  ],
  "attributes": [
    {
      "id": "String",
      "type": "ProductAttributeType",
      "label": "String",
      "value": "String"
    }
  ],
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

**Enums**:
- `VariantType`: `size | color`
- `ProductAttributeType`: `sizes | colors | dimensions | material | weight | care_instructions | custom`

**Indexes**: `{ storeId: 1, slug: 1 }` (unique), `{ storeId: 1, categorySlug: 1 }`, `{ storeId: 1, tags: 1 }`, `{ storeId: 1, price: 1 }`, `{ storeId: 1, rating: -1 }`

---

### 3.4 `customers`

```json
{
  "_id": "ObjectId",
  "storeId": "String (required)",
  "userId": "String? (ref: users._id, linked if registered)",
  "name": "String (required)",
  "email": "String (required)",
  "phone": "String?",
  "avatar": "String?",
  "orders": "Number (default 0)",
  "totalSpent": "Number (default 0)",
  "status": "String (active | blocked)",
  "notes": "String?",
  "addresses": [
    {
      "id": "String",
      "label": "String (e.g. 'Home', 'Office')",
      "firstName": "String",
      "lastName": "String",
      "address": "String",
      "city": "String",
      "state": "String?",
      "zip": "String",
      "country": "String",
      "phone": "String?",
      "isDefault": "Boolean"
    }
  ],
  "paymentMethods": [
    {
      "id": "String",
      "type": "String (visa | mastercard | amex | paypal)",
      "last4": "String",
      "expiryMonth": "Number",
      "expiryYear": "Number",
      "isDefault": "Boolean"
    }
  ],
  "joinedAt": "DateTime",
  "updatedAt": "DateTime"
}
```

**Indexes**: `{ storeId: 1, email: 1 }` (unique), `{ storeId: 1, status: 1 }`, `{ storeId: 1, totalSpent: -1 }`

---

### 3.5 `orders`

```json
{
  "_id": "ObjectId",
  "storeId": "String (required)",
  "orderNumber": "String (required, e.g. 'ORD-2026-001284')",
  "customerId": "String (ref: customers._id)",
  "customer": {
    "name": "String",
    "email": "String",
    "avatar": "String?"
  },
  "items": [
    {
      "productId": "String",
      "name": "String",
      "quantity": "Number (>= 1)",
      "price": "Number",
      "image": "String?",
      "selectedVariants": "Map<String, String>? (e.g. { 'Size': 'M', 'Color': 'Black' })"
    }
  ],
  "subtotal": "Number",
  "shipping": "Number",
  "tax": "Number",
  "discount": "Number (default 0)",
  "total": "Number",
  "status": "OrderStatus",
  "paymentStatus": "PaymentStatus",
  "shippingAddress": {
    "firstName": "String",
    "lastName": "String",
    "address": "String",
    "city": "String",
    "state": "String?",
    "zip": "String",
    "country": "String",
    "phone": "String?"
  },
  "shippingMethod": "String (standard | express)",
  "trackingNumber": "String?",
  "couponCode": "String?",
  "notes": "String?",
  "statusHistory": [
    {
      "status": "OrderStatus",
      "changedAt": "DateTime",
      "changedBy": "String (userId)",
      "note": "String?"
    }
  ],
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

**Enums**:
- `OrderStatus`: `pending | processing | shipped | delivered | cancelled`
- `PaymentStatus`: `pending | paid | refunded`

**Indexes**: `{ storeId: 1, orderNumber: 1 }` (unique), `{ storeId: 1, status: 1 }`, `{ storeId: 1, createdAt: -1 }`, `{ storeId: 1, "customer.email": 1 }`

---

### 3.6 `invoices`

```json
{
  "_id": "ObjectId",
  "storeId": "String (required)",
  "invoiceNumber": "String (required, e.g. 'INV-2026-001284')",
  "orderId": "String? (ref: orders._id)",
  "orderNumber": "String?",
  "customerName": "String",
  "customerEmail": "String",
  "items": [
    {
      "name": "String",
      "qty": "Number",
      "unitPrice": "Number",
      "total": "Number"
    }
  ],
  "subtotal": "Number",
  "tax": "Number",
  "taxRate": "Number (percentage)",
  "shipping": "Number",
  "discount": "Number (default 0)",
  "total": "Number",
  "status": "InvoiceStatus",
  "issuedAt": "DateTime",
  "dueAt": "DateTime",
  "paidAt": "DateTime?",
  "notes": "String?",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

**Enums**:
- `InvoiceStatus`: `draft | sent | paid | overdue | void | refunded`

**Indexes**: `{ storeId: 1, invoiceNumber: 1 }` (unique), `{ storeId: 1, status: 1 }`, `{ storeId: 1, dueAt: 1 }`

---

### 3.7 `coupons`

```json
{
  "_id": "ObjectId",
  "storeId": "String (required)",
  "code": "String (required, uppercase)",
  "type": "CouponType (percentage | fixed)",
  "value": "Number (required)",
  "minOrder": "Number (default 0)",
  "usageLimit": "Number (default 100)",
  "used": "Number (default 0)",
  "expiresAt": "DateTime",
  "active": "Boolean (default true)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

**Indexes**: `{ storeId: 1, code: 1 }` (unique), `{ storeId: 1, active: 1 }`

---

### 3.8 `wishlists`

```json
{
  "_id": "ObjectId",
  "storeId": "String (required)",
  "customerId": "String (required, ref: customers._id or users._id)",
  "productIds": ["String (ref: products._id)"],
  "updatedAt": "DateTime"
}
```

**Indexes**: `{ storeId: 1, customerId: 1 }` (unique)

---

### 3.9 `carts`

```json
{
  "_id": "ObjectId",
  "storeId": "String (required)",
  "customerId": "String? (null for guest carts)",
  "sessionId": "String? (for guest carts)",
  "items": [
    {
      "productId": "String",
      "quantity": "Number (>= 1)",
      "selectedVariants": "Map<String, String>?"
    }
  ],
  "couponCode": "String?",
  "createdAt": "DateTime",
  "updatedAt": "DateTime",
  "expiresAt": "DateTime (TTL, e.g. 30 days)"
}
```

**Indexes**: `{ storeId: 1, customerId: 1 }`, `{ storeId: 1, sessionId: 1 }`, `{ expiresAt: 1 }` (TTL)

---

### 3.10 `shipping_zones`

```json
{
  "_id": "ObjectId",
  "storeId": "String (required)",
  "name": "String (required)",
  "countries": "String (description of covered regions)",
  "flatRate": "Number",
  "freeThreshold": "Number",
  "weightRate": "Number ($/kg)",
  "estimatedDays": "String (e.g. '5-7')",
  "createdAt": "DateTime"
}
```

**Indexes**: `{ storeId: 1 }`

---

### 3.11 `tax_rules`

```json
{
  "_id": "ObjectId",
  "storeId": "String (required)",
  "name": "String (required)",
  "region": "String",
  "rate": "Number (percentage)",
  "includedInPrice": "Boolean (default false)",
  "active": "Boolean (default true)",
  "createdAt": "DateTime"
}
```

**Indexes**: `{ storeId: 1, active: 1 }`

---

### 3.12 `plans` (Platform-level, no storeId)

```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "tier": "PlanTier (required, unique)",
  "description": "String",
  "monthlyPrice": "Number",
  "yearlyPrice": "Number",
  "trialDays": "Number (default 0)",
  "popular": "Boolean (default false)",
  "limits": {
    "maxProducts": "Number (-1 = unlimited)",
    "maxMonthlyOrders": "Number (-1 = unlimited)",
    "maxStaffAccounts": "Number (-1 = unlimited)",
    "customDomain": "Boolean",
    "advancedAnalytics": "Boolean",
    "abandonedCart": "Boolean",
    "advancedPromotions": "Boolean",
    "multiWarehouse": "Boolean",
    "apiAccess": "Boolean",
    "webhooks": "Boolean",
    "invoiceCustomization": "String (basic | advanced)",
    "automatedEmails": "Boolean",
    "prioritySupport": "Boolean"
  },
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

**Indexes**: `{ tier: 1 }` (unique)

---

### 3.13 `subscriptions` (Platform-level)

```json
{
  "_id": "ObjectId",
  "storeId": "String (required, ref: stores._id)",
  "storeName": "String",
  "planId": "String (ref: plans._id)",
  "planName": "String",
  "planTier": "PlanTier",
  "status": "SubscriptionStatus",
  "billingCycle": "BillingCycle (monthly | yearly)",
  "currentPeriodStart": "DateTime",
  "currentPeriodEnd": "DateTime",
  "amount": "Number",
  "currency": "String (default 'USD')",
  "stripeSubscriptionId": "String?",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

**Enums**:
- `SubscriptionStatus`: `active | trialing | past_due | cancelled | paused`

**Indexes**: `{ storeId: 1 }` (unique), `{ status: 1 }`, `{ currentPeriodEnd: 1 }`

---

### 3.14 `platform_invoices` (Platform-level)

```json
{
  "_id": "ObjectId",
  "storeId": "String (required)",
  "storeName": "String",
  "invoiceNumber": "String (e.g. 'PLT-2026-000045')",
  "amount": "Number",
  "status": "PlatformInvoiceStatus (paid | pending | failed | refunded)",
  "stripeInvoiceId": "String?",
  "createdAt": "DateTime",
  "paidAt": "DateTime?"
}
```

**Indexes**: `{ storeId: 1 }`, `{ status: 1 }`, `{ createdAt: -1 }`

---

### 3.15 `feature_flags` (Platform-level)

```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "key": "String (required, unique)",
  "description": "String?",
  "enabledForPlans": ["PlanTier"],
  "enabledForStores": ["String (storeId overrides)"],
  "globallyEnabled": "Boolean (default true)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

**Indexes**: `{ key: 1 }` (unique)

---

### 3.16 `audit_logs` (Platform-level)

```json
{
  "_id": "ObjectId",
  "action": "AuditAction",
  "actorId": "String (ref: users._id)",
  "actorName": "String",
  "actorRole": "String (super_admin | store_admin)",
  "targetType": "String (store | plan | user | feature | billing)",
  "targetId": "String",
  "targetName": "String",
  "details": "String",
  "ipAddress": "String",
  "timestamp": "DateTime"
}
```

**Enums**:
- `AuditAction`: `store_created | store_suspended | store_reactivated | plan_changed | impersonation | billing_change | feature_flag_changed | user_created | settings_changed`

**Indexes**: `{ timestamp: -1 }`, `{ action: 1 }`, `{ actorId: 1 }`, `{ targetId: 1 }`

---

### 3.17 `store_templates` (Platform-level, read-only seed data)

```json
{
  "_id": "ObjectId",
  "type": "StoreType (unique)",
  "name": "String",
  "description": "String",
  "icon": "String (emoji)",
  "defaultCategories": ["String"],
  "defaultAttributes": ["String"],
  "previewImage": "String?"
}
```

---

### 3.18 `contact_submissions`

```json
{
  "_id": "ObjectId",
  "storeId": "String? (null for platform-level contact)",
  "type": "String (storefront_contact | sales_inquiry)",
  "name": "String",
  "email": "String",
  "company": "String?",
  "phone": "String?",
  "message": "String",
  "status": "String (new | read | replied)",
  "createdAt": "DateTime"
}
```

---

## 4. REST API Endpoints

### 4.1 Storefront APIs (Public + Customer Auth)

#### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/storefront/{storeSlug}/products` | List products (paginated, filterable) | Public |
| `GET` | `/api/storefront/{storeSlug}/products/{slug}` | Get product by slug | Public |
| `GET` | `/api/storefront/{storeSlug}/products/bestsellers` | Get bestseller products | Public |
| `GET` | `/api/storefront/{storeSlug}/products/search?q=` | Search products | Public |

**Query params for list**: `page`, `size`, `sort` (newest|price-asc|price-desc|rating|name), `category`, `minPrice`, `maxPrice`, `tags`, `inStock`

#### Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/storefront/{storeSlug}/categories` | List all categories | Public |
| `GET` | `/api/storefront/{storeSlug}/categories/{slug}` | Get category with products | Public |

#### Cart

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/storefront/{storeSlug}/cart` | Get current cart | Optional |
| `POST` | `/api/storefront/{storeSlug}/cart/items` | Add item to cart | Optional |
| `PUT` | `/api/storefront/{storeSlug}/cart/items/{productId}` | Update item quantity | Optional |
| `DELETE` | `/api/storefront/{storeSlug}/cart/items/{productId}` | Remove item from cart | Optional |
| `DELETE` | `/api/storefront/{storeSlug}/cart` | Clear cart | Optional |
| `POST` | `/api/storefront/{storeSlug}/cart/coupon` | Apply coupon code | Optional |
| `DELETE` | `/api/storefront/{storeSlug}/cart/coupon` | Remove coupon | Optional |

**Request body for add item**:
```json
{
  "productId": "string",
  "quantity": 1,
  "selectedVariants": { "Size": "M", "Color": "Black" }
}
```

#### Checkout & Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/storefront/{storeSlug}/checkout` | Place order | Customer |
| `GET` | `/api/storefront/{storeSlug}/orders` | List customer's orders | Customer |
| `GET` | `/api/storefront/{storeSlug}/orders/{id}` | Get order details | Customer |

**Checkout request body**:
```json
{
  "shippingAddress": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string",
    "phone": "string"
  },
  "shippingMethod": "standard | express",
  "paymentMethod": {
    "type": "credit_card",
    "stripePaymentMethodId": "pm_xxx"
  },
  "couponCode": "string?"
}
```

#### Wishlist

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/storefront/{storeSlug}/wishlist` | Get wishlist | Customer |
| `POST` | `/api/storefront/{storeSlug}/wishlist/{productId}` | Add to wishlist | Customer |
| `DELETE` | `/api/storefront/{storeSlug}/wishlist/{productId}` | Remove from wishlist | Customer |

#### Customer Account

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/storefront/{storeSlug}/account` | Get account details | Customer |
| `PUT` | `/api/storefront/{storeSlug}/account` | Update profile | Customer |
| `GET` | `/api/storefront/{storeSlug}/account/addresses` | List addresses | Customer |
| `POST` | `/api/storefront/{storeSlug}/account/addresses` | Add address | Customer |
| `PUT` | `/api/storefront/{storeSlug}/account/addresses/{id}` | Update address | Customer |
| `DELETE` | `/api/storefront/{storeSlug}/account/addresses/{id}` | Delete address | Customer |
| `GET` | `/api/storefront/{storeSlug}/account/payment-methods` | List payment methods | Customer |

#### Contact

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/storefront/{storeSlug}/contact` | Submit contact form | Public |

---

### 4.2 Store Admin APIs (STORE_ADMIN auth required)

All endpoints prefixed with `/api/admin` and scoped to the authenticated user's store.

#### Dashboard & Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/dashboard` | KPIs: revenue, orders, customers, AOV, conversion, etc. |
| `GET` | `/api/admin/dashboard/revenue-timeline?period=7\|30\|90\|365` | Revenue + orders over time |
| `GET` | `/api/admin/dashboard/sales-funnel` | Visitors → Product Views → Add to Cart → Checkout → Purchase |
| `GET` | `/api/admin/dashboard/category-revenue` | Revenue breakdown by category |
| `GET` | `/api/admin/dashboard/hourly-traffic` | 24h traffic + conversions |
| `GET` | `/api/admin/dashboard/customer-cohorts` | New vs returning vs churned |
| `GET` | `/api/admin/dashboard/device-breakdown` | Mobile / Desktop / Tablet split |
| `GET` | `/api/admin/dashboard/payment-methods` | Payment method distribution |
| `GET` | `/api/admin/dashboard/top-countries` | Revenue by country |
| `GET` | `/api/admin/dashboard/order-heatmap` | Weekly order distribution (day × hour) |
| `GET` | `/api/admin/dashboard/revenue-forecast` | ML-based revenue forecast |
| `GET` | `/api/admin/dashboard/performance-score` | Radar: revenue, conversion, AOV, retention, satisfaction, growth |
| `GET` | `/api/admin/analytics/sales?period=7\|30\|90` | Detailed sales report |
| `GET` | `/api/admin/analytics/aov-trend` | AOV over time |
| `GET` | `/api/admin/analytics/cart-abandonment` | Abandonment rate over time |
| `GET` | `/api/admin/analytics/customer-segments` | VIP / Regular / Occasional / One-time |
| `GET` | `/api/admin/analytics/repeat-purchase-rate` | Monthly repeat rate |
| `GET` | `/api/admin/analytics/channel-performance` | Organic / Direct / Social / Email / Referral |
| `GET` | `/api/admin/analytics/return-rate-by-category` | Return rates per category |
| `GET` | `/api/admin/analytics/top-products?limit=10` | Best sellers |

#### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/products` | List (paginated, filterable by category, search, stock) |
| `GET` | `/api/admin/products/{id}` | Get by ID |
| `POST` | `/api/admin/products` | Create product |
| `PUT` | `/api/admin/products/{id}` | Update product |
| `DELETE` | `/api/admin/products/{id}` | Delete product |
| `POST` | `/api/admin/products/{id}/images` | Upload product images (multipart) |
| `DELETE` | `/api/admin/products/{id}/images/{imageId}` | Remove image |

**Create/Update product body**:
```json
{
  "name": "string",
  "description": "string",
  "price": 289.00,
  "compareAtPrice": 350.00,
  "categoryId": "string",
  "tags": ["cashmere", "knitwear"],
  "stockCount": 45,
  "variants": [
    { "name": "Size", "type": "size", "options": ["XS", "S", "M", "L", "XL"] },
    { "name": "Color", "type": "color", "options": ["Ivory", "Charcoal"] }
  ],
  "attributes": [
    { "type": "material", "label": "Material", "value": "100% Cashmere" },
    { "type": "care_instructions", "label": "Care Instructions", "value": "Dry clean only" },
    { "type": "dimensions", "label": "Dimensions (W × H)", "value": "38 × 32 cm" },
    { "type": "weight", "label": "Weight", "value": "680g" },
    { "type": "sizes", "label": "Sizes", "value": "XS, S, M, L, XL" },
    { "type": "colors", "label": "Colors", "value": "Ivory, Charcoal, Camel" },
    { "type": "custom", "label": "Country of Origin", "value": "Italy" }
  ]
}
```

#### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/categories` | List all |
| `POST` | `/api/admin/categories` | Create |
| `PUT` | `/api/admin/categories/{id}` | Update |
| `DELETE` | `/api/admin/categories/{id}` | Delete (if no products) |

#### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/orders` | List (paginated, filterable by status, date, search) |
| `GET` | `/api/admin/orders/{id}` | Get detail with full item list and status history |
| `PUT` | `/api/admin/orders/{id}/status` | Update order status |
| `PUT` | `/api/admin/orders/{id}/payment-status` | Update payment status |
| `POST` | `/api/admin/orders/{id}/notes` | Add internal note |

**Update status body**: `{ "status": "processing", "note": "Started packing" }`

**Order status transitions**:
- `pending` → `processing` → `shipped` → `delivered`
- Any status → `cancelled`

#### Invoices

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/invoices` | List (filterable by status) |
| `GET` | `/api/admin/invoices/{id}` | Get detail |
| `POST` | `/api/admin/invoices` | Create manual invoice |
| `PUT` | `/api/admin/invoices/{id}/status` | Update status (send, mark paid, void, refund) |
| `GET` | `/api/admin/invoices/{id}/pdf` | Generate & download PDF |
| `POST` | `/api/admin/invoices/{id}/send` | Email invoice to customer |

#### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/customers` | List (paginated, searchable, filterable by status) |
| `GET` | `/api/admin/customers/{id}` | Get detail with orders and notes |
| `PUT` | `/api/admin/customers/{id}` | Update (status, notes) |
| `PUT` | `/api/admin/customers/{id}/block` | Block customer |
| `PUT` | `/api/admin/customers/{id}/unblock` | Unblock customer |

#### Marketing / Coupons

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/coupons` | List all coupons |
| `POST` | `/api/admin/coupons` | Create coupon |
| `PUT` | `/api/admin/coupons/{id}` | Update coupon |
| `DELETE` | `/api/admin/coupons/{id}` | Delete coupon |
| `PUT` | `/api/admin/coupons/{id}/toggle` | Activate/deactivate |
| `POST` | `/api/admin/coupons/validate` | Validate coupon code |

**Create coupon body**:
```json
{
  "code": "SUMMER25",
  "type": "percentage",
  "value": 25,
  "minOrder": 150,
  "usageLimit": 100,
  "expiresAt": "2026-06-30"
}
```

#### Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/settings` | Get all store settings |
| `PUT` | `/api/admin/settings/store` | Update store profile |
| `PUT` | `/api/admin/settings/branding` | Update branding (colors, logo, style) |
| `PUT` | `/api/admin/settings/payment` | Update payment config |
| `PUT` | `/api/admin/settings/notifications` | Update email notification prefs |
| `PUT` | `/api/admin/settings/returns` | Update return policy |
| `PUT` | `/api/admin/settings/legal` | Update legal pages |
| `POST` | `/api/admin/settings/branding/logo` | Upload logo (multipart) |
| `POST` | `/api/admin/settings/branding/favicon` | Upload favicon (multipart) |

#### Shipping Zones

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/shipping-zones` | List zones |
| `POST` | `/api/admin/shipping-zones` | Create zone |
| `PUT` | `/api/admin/shipping-zones/{id}` | Update zone |
| `DELETE` | `/api/admin/shipping-zones/{id}` | Delete zone |

#### Tax Rules

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/tax-rules` | List rules |
| `POST` | `/api/admin/tax-rules` | Create rule |
| `PUT` | `/api/admin/tax-rules/{id}` | Update rule |
| `DELETE` | `/api/admin/tax-rules/{id}` | Delete rule |
| `PUT` | `/api/admin/tax-rules/{id}/toggle` | Activate/deactivate |

---

### 4.3 Super Admin APIs (SUPER_ADMIN auth required)

All endpoints prefixed with `/api/super-admin`.

#### Platform Overview / BI

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/super-admin/dashboard` | Platform KPIs: MRR, ARR, total stores, churn, GMV |
| `GET` | `/api/super-admin/dashboard/mrr-growth` | MRR timeline with new/churned breakdown |
| `GET` | `/api/super-admin/dashboard/gmv-commission` | GMV + commission over time |
| `GET` | `/api/super-admin/dashboard/plan-distribution` | Stores per plan |
| `GET` | `/api/super-admin/dashboard/churn-analysis` | Churn rate + recovery |
| `GET` | `/api/super-admin/dashboard/ltv-by-plan` | LTV, lifespan, CAC per plan |
| `GET` | `/api/super-admin/dashboard/store-growth` | New/churned stores over time |
| `GET` | `/api/super-admin/dashboard/trial-conversion` | Trial → paid conversion rates |
| `GET` | `/api/super-admin/dashboard/health-score` | Platform health radar |
| `GET` | `/api/super-admin/dashboard/store-leaderboard` | Top stores by GMV |

#### Stores

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/super-admin/stores` | List all stores (paginated, filterable by status, plan) |
| `GET` | `/api/super-admin/stores/{id}` | Get store details |
| `PUT` | `/api/super-admin/stores/{id}` | Update store (status, plan, etc.) |
| `PUT` | `/api/super-admin/stores/{id}/suspend` | Suspend store |
| `PUT` | `/api/super-admin/stores/{id}/reactivate` | Reactivate store |
| `POST` | `/api/super-admin/stores/{id}/impersonate` | Get impersonation token |

#### Plans

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/super-admin/plans` | List all plans |
| `GET` | `/api/super-admin/plans/{id}` | Get plan details |
| `POST` | `/api/super-admin/plans` | Create plan |
| `PUT` | `/api/super-admin/plans/{id}` | Update plan (price, limits) |
| `DELETE` | `/api/super-admin/plans/{id}` | Delete plan (if no subscribers) |

#### Subscriptions / Billing

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/super-admin/subscriptions` | List all subscriptions |
| `GET` | `/api/super-admin/subscriptions/{id}` | Get subscription detail |
| `PUT` | `/api/super-admin/subscriptions/{id}/cancel` | Cancel subscription |
| `PUT` | `/api/super-admin/subscriptions/{id}/pause` | Pause subscription |
| `PUT` | `/api/super-admin/subscriptions/{id}/resume` | Resume subscription |
| `GET` | `/api/super-admin/invoices` | List platform invoices |

#### Feature Flags

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/super-admin/feature-flags` | List all feature flags |
| `POST` | `/api/super-admin/feature-flags` | Create feature flag |
| `PUT` | `/api/super-admin/feature-flags/{id}` | Update (name, description) |
| `DELETE` | `/api/super-admin/feature-flags/{id}` | Delete feature flag |
| `PUT` | `/api/super-admin/feature-flags/{id}/toggle` | Toggle globally enabled |
| `PUT` | `/api/super-admin/feature-flags/{id}/plans` | Update enabled plans |
| `PUT` | `/api/super-admin/feature-flags/{id}/stores` | Update per-store overrides |

**Update plans body**: `{ "enabledForPlans": ["pro", "business", "enterprise"] }`

#### Audit Logs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/super-admin/audit-logs` | List (paginated, filterable by action, actor, date range) |
| `GET` | `/api/super-admin/audit-logs/{id}` | Get log detail |

#### Platform Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/super-admin/settings` | Get all platform settings |
| `PUT` | `/api/super-admin/settings/general` | Update general (name, URL, lang, currency) |
| `PUT` | `/api/super-admin/settings/branding` | Update platform branding |
| `PUT` | `/api/super-admin/settings/payments` | Update Stripe keys, commission, trial config |
| `PUT` | `/api/super-admin/settings/email` | Update email provider config |
| `PUT` | `/api/super-admin/settings/defaults` | Update default store configs |
| `PUT` | `/api/super-admin/settings/security` | Update security policies |
| `PUT` | `/api/super-admin/settings/domains` | Update domain config |

---

### 4.4 Onboarding API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/onboarding/create-store` | Create store from onboarding wizard | Auth (any logged-in user) |

**Request body**:
```json
{
  "storeType": "fashion",
  "storeName": "My Store",
  "branding": {
    "primaryColor": "#1a1a2e",
    "secondaryColor": "#d4a574",
    "stylePreset": "luxury"
  },
  "currency": "USD",
  "taxRate": 8,
  "shippingFlatRate": 15,
  "returnPolicy": "30-day return policy",
  "catalogOption": "skip | manual | csv",
  "paymentMode": "test | live",
  "domainOption": "subdomain | custom",
  "subdomain": "my-store"
}
```

**Response**: Full store object + redirect URL

---

### 4.5 Platform Public APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/platform/plans` | Public pricing page plans |
| `GET` | `/api/platform/templates` | Store template list |
| `POST` | `/api/platform/contact-sales` | Submit sales inquiry |

---

## 5. Business Rules & Logic

### Checkout Flow
1. Validate cart items (stock availability, price correctness)
2. Validate coupon (if applied): check active, not expired, not exceeded limit, min order met
3. Calculate subtotal, apply discount
4. Determine shipping cost based on shipping zone + method + free threshold
5. Calculate tax based on active tax rules for shipping region
6. Create Stripe PaymentIntent (or relevant payment method)
7. On payment success: create Order, create Invoice (if auto-invoice enabled), update stock, increment coupon usage, clear cart
8. Send order confirmation email

### Order Status Workflow
```
pending → processing → shipped → delivered
    ↓         ↓           ↓
  cancelled cancelled  cancelled
```

### Invoice Auto-Generation
- When `store.settings.autoInvoice = true`, create an invoice automatically on order creation
- Invoice status starts as `paid` if payment was immediate

### Coupon Validation Rules
- `active` must be `true`
- `expiresAt` must be in the future
- `used < usageLimit`
- `order subtotal >= minOrder`
- `type === "percentage"` → discount = subtotal × value / 100
- `type === "fixed"` → discount = value

### Stock Management
- On order placed: decrement `stockCount` for each item
- When `stockCount` reaches 0: set `inStock = false`
- On order cancelled: restore stock

### Feature Flag Evaluation
A feature is accessible if:
1. `globallyEnabled === true` AND
2. Store's plan tier is in `enabledForPlans` OR store's ID is in `enabledForStores` (override)

### Subscription Lifecycle
```
trialing → active → (past_due → active | cancelled)
active → paused → active
active → cancelled
```

### Platform Commission
- Calculated as: `(transactionFeePercent / 100) * orderTotal + fixedFeePerTransaction`
- Tracked per store for GMV reporting

---

## 6. Feature Flags System

### Pre-defined Features

| Key | Name | Default Plans |
|-----|------|---------------|
| `abandoned_cart` | Abandoned Cart Recovery | starter, pro, business, enterprise |
| `ai_descriptions` | AI Product Descriptions | pro, business, enterprise |
| `multi_warehouse` | Multi-Warehouse | business, enterprise |
| `advanced_analytics` | Advanced Analytics | pro, business, enterprise |
| `custom_checkout` | Custom Checkout | business, enterprise |
| `webhooks` | Webhook Integrations | pro, business, enterprise |
| `api_access` | API Access | pro, business, enterprise |

### Endpoints (see Section 4.3)
- Full CRUD on flags
- Toggle per-plan enablement
- Per-store overrides
- Matrix view query: `GET /api/super-admin/feature-flags/matrix` → returns all flags × all plans

---

## 7. Settings & Configuration

### Store-Level Settings (9 modules)

| Module | Key Fields |
|--------|------------|
| **Store Profile** | name, email, phone, currency, timezone, weightUnit, description |
| **Branding** | logo, favicon, primaryColor, secondaryColor, stylePreset, fontFamily |
| **Payment** | stripeKeys, testMode, acceptedMethods (credit_card, apple_pay, google_pay, paypal, bank_transfer, cod) |
| **Shipping** | zones[] with flatRate, freeThreshold, weightRate, estimatedDays |
| **Tax** | rules[] with name, region, rate, includedInPrice, active |
| **Invoice** | prefix, autoGenerate, paymentTerms, companyInfo |
| **Notifications** | onOrder, onShipment, onDelivery, onRefund, onAbandonedCart |
| **Returns** | windowDays, restockFeePercent, requireApproval, allowExchanges |
| **Legal** | termsOfService, privacyPolicy, refundPolicy, gdprEnabled, cookieConsent |

### Platform-Level Settings (7 modules)

| Module | Key Fields |
|--------|------------|
| **General** | platformName, platformURL, supportEmail, defaultLang, defaultCurrency, dateFormat |
| **Branding** | logo, primaryColor, accentColor, socialLinks |
| **Payments** | stripeKeys, webhookSecret, transactionFee%, fixedFee, stripeConnect, trialDays, requireCardForTrial, gracePeriodDays |
| **Email** | provider (smtp/sendgrid/ses/resend), fromName, fromEmail, replyTo, templates[] |
| **Defaults** | defaultTaxRate, taxIncluded, flatRate, freeThreshold, invoicePrefix, paymentTerms, returnWindow, restockFee |
| **Security** | 2FA, rateLimiting, sessionTimeout, ipWhitelist, forcePasswordReset, auditApiCalls, maxConcurrentSessions, passwordMinLength |
| **Domains** | platformDomain, subdomainSuffix, wildcardSSL, customDomainInstructions |

---

## 8. Internationalization

### Supported Languages
- `en` — English (LTR)
- `fr` — French (LTR)
- `ar` — Arabic (RTL)

### Implementation
- Store translations in a `translations` collection or static config
- API responses include `dir: "ltr" | "rtl"` based on language header
- All user-facing strings should be translatable
- Accept `Accept-Language` header or `?lang=` query param

---

## 9. Payments & Billing

### Store-Level (Stripe Connect)
- Each store has its own Stripe Connect account
- Platform collects commission on each transaction
- Supports test/live mode toggle

### Platform-Level (SaaS Billing)
- Monthly/yearly subscription billing via Stripe
- Plans: Free → Starter ($29/mo) → Pro ($79/mo) → Business ($199/mo) → Enterprise ($499/mo)
- Trial periods (configurable, default 14 days)
- Grace period for failed payments before suspension
- Webhook endpoints for: `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`, `customer.subscription.updated`

### Stripe Webhooks

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create order, update stock |
| `invoice.paid` | Mark subscription active, create platform invoice |
| `invoice.payment_failed` | Mark subscription past_due, send notification |
| `customer.subscription.deleted` | Mark subscription cancelled, suspend store after grace period |

---

## 10. Analytics & Reporting

### Store Admin Metrics
- Revenue timeline (daily/weekly/monthly)
- Revenue forecast (ML-based or simple moving average)
- Sales funnel (visitors → views → cart → checkout → purchase)
- Category revenue breakdown
- Customer cohorts (new/returning/churned)
- Hourly traffic & conversions
- Device breakdown (mobile/desktop/tablet)
- Payment method distribution
- Top countries by revenue
- Weekly order heatmap
- Performance radar (revenue, conversion, AOV, retention, satisfaction, growth)
- AOV trend
- Cart abandonment rate
- Customer segments (VIP/Regular/Occasional/One-time)
- Repeat purchase rate
- Channel performance (Organic/Direct/Social/Email/Referral)
- Return rate by category
- Top products by units sold

### Super Admin Metrics
- MRR growth with new/churned composition
- ARR (Annual Run Rate)
- GMV + commission tracking
- Plan distribution (stores per plan)
- Churn analysis with recovery rates
- LTV by plan (with LTV:CAC ratios)
- Store growth (new vs churned over time)
- Trial → paid conversion rates
- Platform health radar (Growth, Retention, Revenue, Efficiency, Satisfaction, Adoption)
- Store leaderboard by GMV
- Health metrics (MRR Growth, Retention, NPS, Uptime, Support SLA, Feature Adoption)

---

## Appendix: All Enums Summary

| Enum | Values |
|------|--------|
| `UserRole` | `SUPER_ADMIN`, `STORE_ADMIN`, `STORE_STAFF`, `CUSTOMER` |
| `StoreType` | `fashion`, `electronics`, `cosmetics`, `grocery`, `restaurant`, `digital`, `services`, `general` |
| `StoreStatus` | `active`, `suspended`, `trial`, `cancelled` |
| `PlanTier` | `free`, `starter`, `pro`, `business`, `enterprise` |
| `BillingCycle` | `monthly`, `yearly` |
| `StylePreset` | `minimal`, `bold`, `luxury`, `playful` |
| `OrderStatus` | `pending`, `processing`, `shipped`, `delivered`, `cancelled` |
| `PaymentStatus` | `pending`, `paid`, `refunded` |
| `InvoiceStatus` | `draft`, `sent`, `paid`, `overdue`, `void`, `refunded` |
| `SubscriptionStatus` | `active`, `trialing`, `past_due`, `cancelled`, `paused` |
| `PlatformInvoiceStatus` | `paid`, `pending`, `failed`, `refunded` |
| `CouponType` | `percentage`, `fixed` |
| `VariantType` | `size`, `color` |
| `ProductAttributeType` | `sizes`, `colors`, `dimensions`, `material`, `weight`, `care_instructions`, `custom` |
| `AuditAction` | `store_created`, `store_suspended`, `store_reactivated`, `plan_changed`, `impersonation`, `billing_change`, `feature_flag_changed`, `user_created`, `settings_changed` |
| `SortOption` | `newest`, `price-asc`, `price-desc`, `rating`, `name` |

---

## Appendix: Spring Boot Package Structure (Suggested)

```
com.maison
├── config/          # Security, MongoDB, Stripe, CORS configs
├── controller/
│   ├── auth/        # AuthController
│   ├── storefront/  # StorefrontProductController, CartController, CheckoutController, etc.
│   ├── admin/       # AdminProductController, AdminOrderController, AdminSettingsController, etc.
│   └── superadmin/  # SuperAdminStoreController, PlanController, FeatureFlagController, etc.
├── dto/             # Request/Response DTOs
├── entity/          # MongoDB documents (@Document)
├── enums/           # All enums
├── exception/       # Custom exceptions + global handler
├── repository/      # MongoRepository interfaces
├── security/        # JWT filter, UserDetailsService, role guards
├── service/         # Business logic layer
│   ├── auth/
│   ├── store/
│   ├── product/
│   ├── order/
│   ├── invoice/
│   ├── coupon/
│   ├── analytics/
│   ├── billing/
│   ├── featureflag/
│   └── notification/
└── util/            # Helpers (slug generation, order number generation, etc.)
```

---

*End of specification. This document fully describes the MAISON platform backend requirements.*
