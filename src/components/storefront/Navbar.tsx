import { Link } from "react-router-dom";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { itemCount, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 -ml-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="font-display text-xl lg:text-2xl font-semibold tracking-wide text-foreground">
            MAISON
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="font-body text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/catalog" className="font-body text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
              Shop All
            </Link>
            <Link to="/catalog?category=clothing" className="font-body text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
              Clothing
            </Link>
            <Link to="/catalog?category=accessories" className="font-body text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
              Accessories
            </Link>
            <Link to="/catalog?category=home" className="font-body text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground" asChild>
              <Link to="/admin">
                <User className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-foreground"
              onClick={toggleCart}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs font-semibold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden pb-4 border-t border-border pt-4 flex flex-col gap-3">
            <Link to="/" onClick={() => setMobileOpen(false)} className="font-body text-sm py-2 text-foreground">Home</Link>
            <Link to="/catalog" onClick={() => setMobileOpen(false)} className="font-body text-sm py-2 text-foreground">Shop All</Link>
            <Link to="/catalog?category=clothing" onClick={() => setMobileOpen(false)} className="font-body text-sm py-2 text-foreground">Clothing</Link>
            <Link to="/catalog?category=accessories" onClick={() => setMobileOpen(false)} className="font-body text-sm py-2 text-foreground">Accessories</Link>
            <Link to="/catalog?category=home" onClick={() => setMobileOpen(false)} className="font-body text-sm py-2 text-foreground">Home & Living</Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
