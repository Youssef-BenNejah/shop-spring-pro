import { Link } from "react-router-dom";
import { ShoppingBag, Search, User, Menu, X, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTranslation } from "@/context/LanguageContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/shared/ThemeToggle";
import LanguageSelector from "@/components/shared/LanguageSelector";

const Navbar = () => {
  const { itemCount, toggleCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/catalog", label: t("nav.shop") },
    { to: "/catalog?category=clothing", label: t("nav.clothing") },
    { to: "/catalog?category=accessories", label: t("nav.accessories") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button className="lg:hidden p-2 -ml-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="font-display text-xl lg:text-2xl font-semibold tracking-wide text-foreground">
            MAISON
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="font-body text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            <LanguageSelector />
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative text-foreground" asChild>
              <Link to="/wishlist">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground" asChild>
              <Link to="/account"><User className="w-5 h-5" /></Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative text-foreground" onClick={toggleCart}>
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs font-semibold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden pb-4 border-t border-border pt-4 flex flex-col gap-3">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="font-body text-sm py-2 text-foreground">
                {link.label}
              </Link>
            ))}
            <Link to="/faq" onClick={() => setMobileOpen(false)} className="font-body text-sm py-2 text-foreground">{t("nav.faq")}</Link>
            <Link to="/admin" onClick={() => setMobileOpen(false)} className="font-body text-sm py-2 text-muted-foreground">{t("nav.admin")}</Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
