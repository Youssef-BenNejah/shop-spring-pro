import { Link } from "react-router-dom";
import { Star, ShoppingBag } from "lucide-react";
import { Product } from "@/types/ecommerce";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addItem } = useCart();
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} className="group">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] bg-secondary rounded-lg overflow-hidden mb-3">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          {product.compareAtPrice && (
            <span className="absolute top-3 start-3 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded">
              -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="font-body text-sm font-medium text-foreground">{t("product.soldOut")}</span>
            </div>
          )}
          <div className="absolute bottom-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="icon" className="rounded-full bg-primary text-primary-foreground shadow-lg h-10 w-10"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (product.inStock) addItem(product); }}
              disabled={!product.inStock}>
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>
      <div className="space-y-1">
        <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{product.category}</p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-body text-sm font-medium text-foreground leading-snug group-hover:text-accent transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-body text-sm font-semibold text-foreground">${product.price}</span>
          {product.compareAtPrice && <span className="font-body text-xs text-muted-foreground line-through">${product.compareAtPrice}</span>}
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-accent text-accent" />
          <span className="font-body text-xs text-muted-foreground">{product.rating} ({product.reviewCount})</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
