import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import StorefrontLayout from "@/components/storefront/StorefrontLayout";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const CartPage = () => {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <Link to="/catalog" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>

        <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-8">Shopping Bag</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="font-body text-lg text-muted-foreground mb-6">Your bag is empty</p>
            <Button asChild><Link to="/catalog">Start Shopping</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 lg:gap-6 p-4 rounded-lg border border-border bg-card">
                  <div className="w-24 h-32 lg:w-32 lg:h-40 bg-secondary rounded overflow-hidden flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${item.product.slug}`} className="font-body text-sm lg:text-base font-medium text-foreground hover:text-accent transition-colors">
                        {item.product.name}
                      </Link>
                      <p className="font-body text-xs text-muted-foreground mt-1">{item.product.category}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-body text-sm w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeItem(item.product.id)} className="ml-3 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-body text-sm font-semibold text-foreground">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-24 self-start">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h2 className="font-display text-lg text-foreground">Order Summary</h2>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Tax (est.)</span>
                    <span className="text-foreground">${tax.toFixed(2)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-body">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-semibold text-foreground text-lg">${total.toFixed(2)}</span>
                </div>
                {subtotal < 200 && (
                  <p className="font-body text-xs text-muted-foreground">Add ${(200 - subtotal).toFixed(2)} more for free shipping</p>
                )}
                <Button className="w-full font-body" size="lg">
                  Proceed to Checkout
                </Button>
                <p className="font-body text-xs text-muted-foreground text-center">Secure checkout powered by Stripe</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default CartPage;
