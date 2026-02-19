import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import StorefrontLayout from "@/components/storefront/StorefrontLayout";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Wishlist = () => {
  const { t } = useTranslation();
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleAddToBag = (product: typeof items[0]) => {
    addItem(product);
    removeItem(product.id);
    toast.success(`${product.name} moved to bag`);
  };

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-2">
            <Heart className="inline w-8 h-8 me-3" />
            Wishlist
          </h1>
          <p className="font-body text-sm text-muted-foreground">{items.length} saved items</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="font-display text-xl text-foreground mb-2">Your wishlist is empty</h2>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Save items you love to your wishlist and shop them later.
            </p>
            <Button asChild>
              <Link to="/catalog" className="font-body">{t("cart.startShopping")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map(product => (
              <div key={product.id} className="group border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
                <Link to={`/product/${product.slug}`} className="block aspect-[3/4] bg-secondary overflow-hidden">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{product.category}</p>
                    <Link to={`/product/${product.slug}`} className="font-body text-sm font-medium text-foreground hover:underline line-clamp-1">
                      {product.name}
                    </Link>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-body text-lg font-semibold text-foreground">{product.price} TND</span>
                    {product.compareAtPrice && (
                      <span className="font-body text-sm text-muted-foreground line-through">{product.compareAtPrice} TND</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 font-body text-xs"
                      disabled={!product.inStock}
                      onClick={() => handleAddToBag(product)}
                    >
                      <ShoppingBag className="w-3 h-3 me-1" />
                      {product.inStock ? t("product.addToBag") : t("product.soldOut")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => { removeItem(product.id); toast.success("Removed from wishlist"); }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default Wishlist;
