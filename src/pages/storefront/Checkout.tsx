import { useState } from "react";
import { Link } from "react-router-dom";
import StorefrontLayout from "@/components/storefront/StorefrontLayout";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { t } = useTranslation();
  const [step, setStep] = useState<"shipping" | "payment" | "done">("shipping");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "delivery">("card");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = 7;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "WELCOME10") {
      setDiscount(subtotal * 0.1);
      toast.success("10% discount applied!");
    } else if (promoCode.toUpperCase() === "FLAT20") {
      setDiscount(20);
      toast.success("20 TND discount applied!");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("done");
    clearCart();
  };

  if (items.length === 0 && step !== "done") {
    return (
      <StorefrontLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="font-body text-lg text-muted-foreground mb-4">{t("cart.empty")}</p>
          <Button asChild><Link to="/catalog">{t("cart.startShopping")}</Link></Button>
        </div>
      </StorefrontLayout>
    );
  }

  if (step === "done") {
    return (
      <StorefrontLayout>
        <div className="container mx-auto px-4 py-20 text-center max-w-md">
          <CheckCircle className="w-16 h-16 mx-auto text-success mb-4" />
          <h1 className="font-display text-3xl text-foreground mb-2">{t("checkout.orderPlaced")}</h1>
          <p className="font-body text-muted-foreground mb-8">{t("checkout.orderPlacedDesc")}</p>
          <Button asChild><Link to="/">{t("checkout.backToHome")}</Link></Button>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <h1 className="font-display text-3xl text-foreground mb-8">{t("checkout.title")}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-8">
            {/* Shipping */}
            <div className="space-y-4">
              <h2 className="font-display text-xl text-foreground">{t("checkout.shipping")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label className="font-body text-sm">{t("checkout.firstName")}</Label><Input required className="mt-1" /></div>
                <div><Label className="font-body text-sm">{t("checkout.lastName")}</Label><Input required className="mt-1" /></div>
                <div className="sm:col-span-2"><Label className="font-body text-sm">{t("checkout.email")}</Label><Input type="email" required className="mt-1" /></div>
                <div className="sm:col-span-2"><Label className="font-body text-sm">{t("checkout.address")}</Label><Input required className="mt-1" /></div>
                <div><Label className="font-body text-sm">{t("checkout.city")}</Label><Input required className="mt-1" /></div>
                <div><Label className="font-body text-sm">{t("checkout.state")}</Label><Input className="mt-1" /></div>
                <div><Label className="font-body text-sm">{t("checkout.zip")}</Label><Input required className="mt-1" /></div>
                <div><Label className="font-body text-sm">{t("checkout.country")}</Label><Input required className="mt-1" defaultValue="United States" /></div>
                <div><Label className="font-body text-sm">{t("checkout.phone")}</Label><Input type="tel" className="mt-1" /></div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <h2 className="font-display text-xl text-foreground">{t("checkout.payment")}</h2>
              <div className="space-y-2">
                {[{ id: "card" as const, label: t("checkout.cardNumber") ? "Pay Online (Card)" : "Pay Online (Card)" }, { id: "delivery" as const, label: "Cash on Delivery" }].map(m => (
                  <label key={m.id} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === m.id ? "border-foreground bg-secondary/50" : "border-border"}`}>
                    <input type="radio" name="payment" checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} className="accent-foreground" />
                    <span className="font-body text-sm">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Card Details (only if online) */}
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <h2 className="font-display text-xl text-foreground">Card Details</h2>
                <div><Label className="font-body text-sm">{t("checkout.cardNumber")}</Label><Input required placeholder="4242 4242 4242 4242" className="mt-1" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="font-body text-sm">{t("checkout.expiry")}</Label><Input required placeholder="12/28" className="mt-1" /></div>
                  <div><Label className="font-body text-sm">{t("checkout.cvc")}</Label><Input required placeholder="123" className="mt-1" /></div>
                </div>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full font-body">{t("checkout.placeOrder")} — {total.toFixed(2)} TND</Button>
          </form>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="font-display text-lg text-foreground">{t("cart.orderSummary")}</h2>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between font-body text-sm">
                    <span className="text-foreground">{item.product.name} × {item.quantity}</span>
                    <span className="text-foreground">{(item.product.price * item.quantity).toFixed(2)} TND</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex gap-2">
                <Input placeholder={t("checkout.promoCode")} value={promoCode} onChange={e => setPromoCode(e.target.value)} className="font-body text-sm" />
                <Button variant="outline" onClick={handleApplyPromo} className="font-body text-sm shrink-0">{t("checkout.apply")}</Button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">{t("cart.subtotal")}</span><span>{subtotal.toFixed(2)} TND</span></div>
                {discount > 0 && <div className="flex justify-between font-body text-sm"><span className="text-success">Discount</span><span className="text-success">-{discount.toFixed(2)} TND</span></div>}
                <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">{t("cart.shipping")}</span><span>{shipping.toFixed(2)} TND</span></div>
                <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">{t("cart.tax")}</span><span>{tax.toFixed(2)} TND</span></div>
              </div>
              <Separator />
              <div className="flex justify-between font-body"><span className="font-semibold">{t("cart.total")}</span><span className="font-semibold text-lg">{total.toFixed(2)} TND</span></div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default Checkout;
