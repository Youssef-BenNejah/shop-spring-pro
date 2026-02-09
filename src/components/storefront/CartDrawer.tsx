import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/context/LanguageContext";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const { t } = useTranslation();

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-lg">{t("cart.title")} ({itemCount})</SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
            <p className="font-body text-sm text-muted-foreground">{t("cart.empty")}</p>
            <Button variant="outline" onClick={() => setCartOpen(false)} asChild>
              <Link to="/catalog">{t("cart.continueShopping")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-4">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4 p-3 rounded-lg bg-secondary/50">
                  <div className="w-20 h-24 bg-secondary rounded overflow-hidden flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body text-sm font-medium text-foreground truncate">{item.product.name}</h4>
                    <p className="font-body text-sm text-muted-foreground">${item.product.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-secondary transition-colors"><Minus className="w-3 h-3" /></button>
                      <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-secondary transition-colors"><Plus className="w-3 h-3" /></button>
                      <button onClick={() => removeItem(item.product.id)} className="ms-auto text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <p className="font-body text-xs text-muted-foreground">{t("cart.shippingCalculated")}</p>
              <Button className="w-full" size="lg" onClick={() => setCartOpen(false)} asChild>
                <Link to="/cart">{t("cart.viewBag")}</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
