import { Product, Category, Order } from "@/types/ecommerce";

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joinedAt: string;
  status: "active" | "blocked";
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  usageLimit: number;
  used: number;
  expiresAt: string;
  active: boolean;
}

export const categories: Category[] = [
  { id: "1", name: "Clothing", slug: "clothing", description: "Premium apparel", productCount: 4 },
  { id: "2", name: "Accessories", slug: "accessories", description: "Curated accessories", productCount: 3 },
  { id: "3", name: "Home", slug: "home", description: "Refined living", productCount: 3 },
  { id: "4", name: "Beauty", slug: "beauty", description: "Natural beauty", productCount: 2 },
];

export const products: Product[] = [
  {
    id: "1", name: "Cashmere Oversized Sweater", slug: "cashmere-sweater",
    description: "Luxuriously soft cashmere sweater in a relaxed oversized silhouette. Perfect for layering during transitional seasons.",
    price: 289, compareAtPrice: 350, images: ["/placeholder.svg"],
    category: "Clothing", categorySlug: "clothing", tags: ["cashmere", "knitwear", "bestseller"],
    rating: 4.8, reviewCount: 124, inStock: true, stockCount: 45,
    variants: [
      { id: "v1", name: "Size", type: "size", options: ["XS", "S", "M", "L", "XL"] },
      { id: "v2", name: "Color", type: "color", options: ["Ivory", "Charcoal", "Camel"] },
    ],
  },
  {
    id: "2", name: "Tailored Wool Coat", slug: "wool-coat",
    description: "A timeless double-breasted wool coat with a structured silhouette and satin lining.",
    price: 495, images: ["/placeholder.svg"],
    category: "Clothing", categorySlug: "clothing", tags: ["outerwear", "wool", "premium"],
    rating: 4.9, reviewCount: 87, inStock: true, stockCount: 22,
    variants: [
      { id: "v3", name: "Size", type: "size", options: ["S", "M", "L"] },
      { id: "v4", name: "Color", type: "color", options: ["Black", "Navy", "Camel"] },
    ],
  },
  {
    id: "3", name: "Silk Midi Dress", slug: "silk-midi-dress",
    description: "Elegant silk midi dress with a flattering drape and subtle sheen. Versatile for day to evening.",
    price: 375, compareAtPrice: 420, images: ["/placeholder.svg"],
    category: "Clothing", categorySlug: "clothing", tags: ["silk", "dress", "elegant"],
    rating: 4.7, reviewCount: 56, inStock: true, stockCount: 18,
  },
  {
    id: "4", name: "Merino Turtleneck", slug: "merino-turtleneck",
    description: "Fine-gauge merino wool turtleneck. A wardrobe essential in a refined palette.",
    price: 145, images: ["/placeholder.svg"],
    category: "Clothing", categorySlug: "clothing", tags: ["merino", "basics"],
    rating: 4.6, reviewCount: 203, inStock: true, stockCount: 89,
    variants: [
      { id: "v5", name: "Size", type: "size", options: ["XS", "S", "M", "L", "XL"] },
      { id: "v6", name: "Color", type: "color", options: ["Black", "Cream", "Olive", "Burgundy"] },
    ],
  },
  {
    id: "5", name: "Leather Tote Bag", slug: "leather-tote",
    description: "Full-grain Italian leather tote with interior organization. Ages beautifully.",
    price: 425, images: ["/placeholder.svg"],
    category: "Accessories", categorySlug: "accessories", tags: ["leather", "bags", "bestseller"],
    rating: 4.9, reviewCount: 312, inStock: true, stockCount: 34,
    variants: [{ id: "v7", name: "Color", type: "color", options: ["Tan", "Black", "Cognac"] }],
  },
  {
    id: "6", name: "Gold Minimal Watch", slug: "gold-watch",
    description: "Slim-profile gold watch with a Swiss quartz movement and Italian leather strap.",
    price: 695, images: ["/placeholder.svg"],
    category: "Accessories", categorySlug: "accessories", tags: ["watches", "gold", "luxury"],
    rating: 4.8, reviewCount: 67, inStock: true, stockCount: 12,
  },
  {
    id: "7", name: "Cashmere Scarf", slug: "cashmere-scarf",
    description: "Lightweight cashmere scarf in a generous size. Perfect year-round accessory.",
    price: 165, compareAtPrice: 195, images: ["/placeholder.svg"],
    category: "Accessories", categorySlug: "accessories", tags: ["cashmere", "scarves"],
    rating: 4.5, reviewCount: 89, inStock: true, stockCount: 56,
  },
  {
    id: "8", name: "Ceramic Vase Set", slug: "ceramic-vase-set",
    description: "Set of three handcrafted ceramic vases in organic shapes. Matte finish in earthy tones.",
    price: 185, images: ["/placeholder.svg"],
    category: "Home", categorySlug: "home", tags: ["ceramics", "decor", "handmade"],
    rating: 4.7, reviewCount: 45, inStock: true, stockCount: 28,
  },
  {
    id: "9", name: "Linen Throw Blanket", slug: "linen-throw",
    description: "Stonewashed French linen throw in a generous size. Naturally temperature-regulating.",
    price: 220, images: ["/placeholder.svg"],
    category: "Home", categorySlug: "home", tags: ["linen", "throws", "bedroom"],
    rating: 4.6, reviewCount: 73, inStock: true, stockCount: 41,
  },
  {
    id: "10", name: "Soy Candle Trio", slug: "soy-candle-trio",
    description: "Hand-poured soy candles in three signature scents: Cedarwood, Fig Leaf, and Sea Salt.",
    price: 78, images: ["/placeholder.svg"],
    category: "Home", categorySlug: "home", tags: ["candles", "fragrance"],
    rating: 4.8, reviewCount: 156, inStock: true, stockCount: 67,
  },
  {
    id: "11", name: "Botanical Face Oil", slug: "botanical-face-oil",
    description: "Nourishing facial oil with rosehip, jojoba, and vitamin E. For radiant, hydrated skin.",
    price: 88, images: ["/placeholder.svg"],
    category: "Beauty", categorySlug: "beauty", tags: ["skincare", "organic", "bestseller"],
    rating: 4.9, reviewCount: 234, inStock: true, stockCount: 78,
  },
  {
    id: "12", name: "Hand Cream Collection", slug: "hand-cream-collection",
    description: "Three luxurious hand creams in signature scents. Enriched with shea butter and almond oil.",
    price: 56, compareAtPrice: 72, images: ["/placeholder.svg"],
    category: "Beauty", categorySlug: "beauty", tags: ["bodycare", "gifts"],
    rating: 4.7, reviewCount: 98, inStock: false, stockCount: 0,
  },
];

export const sampleCustomers: Customer[] = [
  { id: "c1", name: "Emma Thompson", email: "emma@example.com", orders: 8, totalSpent: 2340, joinedAt: "2025-06-15", status: "active" },
  { id: "c2", name: "James Chen", email: "james.c@example.com", orders: 3, totalSpent: 890, joinedAt: "2025-09-22", status: "active" },
  { id: "c3", name: "Sophie Martin", email: "sophie.m@example.com", orders: 12, totalSpent: 4560, joinedAt: "2025-03-10", status: "active" },
  { id: "c4", name: "Alex Rivera", email: "alex.r@example.com", orders: 5, totalSpent: 1230, joinedAt: "2025-08-01", status: "active" },
  { id: "c5", name: "Olivia Park", email: "olivia.p@example.com", orders: 1, totalSpent: 495, joinedAt: "2026-01-20", status: "blocked", notes: "Chargeback dispute" },
  { id: "c6", name: "Lucas Bernard", email: "lucas.b@example.com", orders: 6, totalSpent: 1890, joinedAt: "2025-07-12", status: "active" },
  { id: "c7", name: "Amara Diallo", email: "amara.d@example.com", orders: 4, totalSpent: 967, joinedAt: "2025-11-05", status: "active" },
  { id: "c8", name: "Yuki Tanaka", email: "yuki.t@example.com", orders: 9, totalSpent: 3120, joinedAt: "2025-04-18", status: "active" },
];

export const sampleCoupons: Coupon[] = [
  { id: "cp1", code: "WELCOME10", type: "percentage", value: 10, minOrder: 50, usageLimit: 500, used: 234, expiresAt: "2026-06-30", active: true },
  { id: "cp2", code: "SPRING25", type: "percentage", value: 25, minOrder: 150, usageLimit: 100, used: 67, expiresAt: "2026-04-30", active: true },
  { id: "cp3", code: "FLAT20", type: "fixed", value: 20, minOrder: 100, usageLimit: 200, used: 145, expiresAt: "2026-03-15", active: true },
  { id: "cp4", code: "VIP50", type: "fixed", value: 50, minOrder: 300, usageLimit: 50, used: 12, expiresAt: "2026-12-31", active: true },
  { id: "cp5", code: "SUMMER15", type: "percentage", value: 15, minOrder: 75, usageLimit: 300, used: 300, expiresAt: "2025-09-30", active: false },
];

export const sampleOrders: Order[] = [
  {
    id: "1", orderNumber: "ORD-2026-001284",
    customer: { name: "Emma Thompson", email: "emma@example.com" },
    items: [
      { name: "Cashmere Oversized Sweater", quantity: 1, price: 289 },
      { name: "Cashmere Scarf", quantity: 1, price: 165 },
    ],
    subtotal: 454, shipping: 0, tax: 36.32, total: 490.32,
    status: "delivered", paymentStatus: "paid", createdAt: "2026-02-08T14:30:00Z",
    shippingAddress: "42 Kings Road, London SW3 4ND",
  },
  {
    id: "2", orderNumber: "ORD-2026-001285",
    customer: { name: "James Chen", email: "james.c@example.com" },
    items: [{ name: "Leather Tote Bag", quantity: 1, price: 425 }],
    subtotal: 425, shipping: 15, tax: 35.20, total: 475.20,
    status: "shipped", paymentStatus: "paid", createdAt: "2026-02-08T09:15:00Z",
    shippingAddress: "88 Fifth Avenue, New York NY 10011",
  },
  {
    id: "3", orderNumber: "ORD-2026-001286",
    customer: { name: "Sophie Martin", email: "sophie.m@example.com" },
    items: [
      { name: "Silk Midi Dress", quantity: 1, price: 375 },
      { name: "Gold Minimal Watch", quantity: 1, price: 695 },
      { name: "Botanical Face Oil", quantity: 2, price: 88 },
    ],
    subtotal: 1246, shipping: 0, tax: 99.68, total: 1345.68,
    status: "processing", paymentStatus: "paid", createdAt: "2026-02-07T18:45:00Z",
  },
  {
    id: "4", orderNumber: "ORD-2026-001287",
    customer: { name: "Alex Rivera", email: "alex.r@example.com" },
    items: [
      { name: "Soy Candle Trio", quantity: 2, price: 78 },
      { name: "Linen Throw Blanket", quantity: 1, price: 220 },
    ],
    subtotal: 376, shipping: 12, tax: 31.04, total: 419.04,
    status: "pending", paymentStatus: "pending", createdAt: "2026-02-09T08:00:00Z",
  },
  {
    id: "5", orderNumber: "ORD-2026-001288",
    customer: { name: "Olivia Park", email: "olivia.p@example.com" },
    items: [{ name: "Tailored Wool Coat", quantity: 1, price: 495 }],
    subtotal: 495, shipping: 0, tax: 39.60, total: 534.60,
    status: "cancelled", paymentStatus: "refunded", createdAt: "2026-02-06T12:20:00Z",
  },
];

export const salesData = [
  { date: "Feb 3", sales: 1240, orders: 8 },
  { date: "Feb 4", sales: 1890, orders: 12 },
  { date: "Feb 5", sales: 2340, orders: 15 },
  { date: "Feb 6", sales: 1670, orders: 11 },
  { date: "Feb 7", sales: 3200, orders: 21 },
  { date: "Feb 8", sales: 2890, orders: 18 },
  { date: "Feb 9", sales: 1560, orders: 10 },
];

export const getBestSellers = () => products.filter(p => p.tags.includes("bestseller"));
export const getProductsByCategory = (slug: string) => products.filter(p => p.categorySlug === slug);
export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug);
