export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  categorySlug: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
}

export interface ProductVariant {
  id: string;
  name: string;
  type: "size" | "color";
  options: string[];
}

export type ProductAttributeType = "sizes" | "colors" | "dimensions" | "material" | "weight" | "care_instructions" | "custom";

export interface ProductAttribute {
  id: string;
  type: ProductAttributeType;
  label: string;
  value: string; // comma-separated for multi-value (sizes, colors), "WxH" for dimensions, plain text otherwise
}

export const ATTRIBUTE_PRESETS: { type: ProductAttributeType; label: string; placeholder: string; icon: string }[] = [
  { type: "sizes", label: "Sizes", placeholder: "XS, S, M, L, XL", icon: "Ruler" },
  { type: "colors", label: "Colors", placeholder: "Black, White, Navy", icon: "Palette" },
  { type: "dimensions", label: "Dimensions (W × H)", placeholder: "30 × 45 cm", icon: "Maximize" },
  { type: "material", label: "Material", placeholder: "100% Organic Cotton", icon: "Layers" },
  { type: "weight", label: "Weight", placeholder: "250g", icon: "Scale" },
  { type: "care_instructions", label: "Care Instructions", placeholder: "Machine wash cold, tumble dry low", icon: "Sparkles" },
  { type: "custom", label: "Custom", placeholder: "Enter value", icon: "Settings" },
];

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: { name: string; email: string; avatar?: string };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "pending" | "refunded";
  createdAt: string;
  shippingAddress?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export type SortOption = "newest" | "price-asc" | "price-desc" | "rating" | "name";
