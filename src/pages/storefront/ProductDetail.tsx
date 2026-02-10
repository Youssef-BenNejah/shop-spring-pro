import { useParams, Link } from "react-router-dom";
import { Star, Minus, Plus, ShoppingBag, Heart, ArrowLeft, Truck, RotateCcw, Shield } from "lucide-react";
import StorefrontLayout from "@/components/storefront/StorefrontLayout";
import ProductCard from "@/components/storefront/ProductCard";
import { getProductBySlug, products } from "@/data/mock-data";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  if (!product) {
    return (
      <StorefrontLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl mb-4">{t("product.notFound")}</h1>
          <Button asChild variant="outline"><Link to="/catalog">{t("product.backToShop")}</Link></Button>
        </div>
      </StorefrontLayout>
    );
  }

  const related = products.filter(p => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  const handleAddToBag = () => {
    addItem(product, quantity);
    toast.success(t("common.success"), { description: `${product.name} × ${quantity}` });
  };

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-12">
        <Link to="/catalog" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />{t("product.backToShop")}
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col">
            <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-2">{product.category}</p>
            <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}`} />
                ))}
              </div>
              <span className="font-body text-sm text-muted-foreground">{product.rating} ({product.reviewCount} {t("product.reviews")})</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-body text-2xl font-semibold text-foreground">${product.price}</span>
              {product.compareAtPrice && <span className="font-body text-lg text-muted-foreground line-through">${product.compareAtPrice}</span>}
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            {product.variants?.map(variant => (
              <div key={variant.id} className="mb-5">
                <label className="font-body text-sm font-medium text-foreground mb-2 block">
                  {variant.type === "size" ? t("product.size") : t("product.color")}: <span className="text-muted-foreground font-normal">{selectedVariants[variant.name] || t("product.select")}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map(opt => (
                    <button key={opt} onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))}
                      className={`px-4 py-2 border rounded-md font-body text-sm transition-colors ${selectedVariants[variant.name] === opt ? "border-foreground bg-foreground text-primary-foreground" : "border-border text-foreground hover:border-foreground"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-md">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-secondary transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="font-body text-sm w-10 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-secondary transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              <Button size="lg" className="flex-1 font-body" disabled={!product.inStock} onClick={handleAddToBag}>
                <ShoppingBag className="w-4 h-4 me-2" />{product.inStock ? t("product.addToBag") : t("product.soldOut")}
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11" onClick={() => { const added = toggleItem(product); toast.success(added ? "Added to wishlist" : "Removed from wishlist"); }}>
                <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? "fill-destructive text-destructive" : ""}`} />
              </Button>
            </div>
            <p className="font-body text-xs text-muted-foreground mb-6">{product.inStock ? `${product.stockCount} ${t("product.inStock")}` : t("product.soldOut")}</p>
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-border">
              <div className="text-center"><Truck className="w-5 h-5 mx-auto mb-1 text-muted-foreground" /><p className="font-body text-xs text-muted-foreground">{t("product.freeShipping")}</p></div>
              <div className="text-center"><RotateCcw className="w-5 h-5 mx-auto mb-1 text-muted-foreground" /><p className="font-body text-xs text-muted-foreground">{t("product.returns")}</p></div>
              <div className="text-center"><Shield className="w-5 h-5 mx-auto mb-1 text-muted-foreground" /><p className="font-body text-xs text-muted-foreground">{t("product.secureCheckout")}</p></div>
            </div>
          </motion.div>
        </div>
        {related.length > 0 && (
          <section className="mt-16 lg:mt-24">
            <h2 className="font-display text-2xl text-foreground mb-8">{t("section.youMayAlsoLike")}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">{related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
          </section>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default ProductDetail;
